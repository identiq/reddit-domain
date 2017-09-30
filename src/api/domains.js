import {Router} from 'express';
import request from 'request';
import async from 'async';
import moment from 'moment';
import _ from 'lodash';

export default ({config, db}) => {

  const UNTIL = moment(config.FETCH_UNTIL_DATE).startOf('day');
  const SORTING = ['top', 'controversial'];

  let domain = Router();

  domain.get('/:subreddit', (req, res) => {

    let uniqDomains = [];
    let occurenceDomains = [];
    let fetchDate = moment();
    let after = true;

    async.whilst(
      () => {
        return after;
      },
      (callback) => {

        let url = `${config.REDDIT_API_URL}/r/${req.params.subreddit}/${_.first(SORTING)}.json?t=month${after ? '&after=' + after : ''}`;

        request(url, (error, response, body) => {

          let reddit = JSON.parse(body);

          after = reddit.data.after;

          if(!after) {
            return callback(null, after);
          }

          async.eachSeries(reddit.data.children, (sub, next) => {

            fetchDate = moment.unix(sub.data.created);

            if(fetchDate.isBefore(UNTIL)) {
              return next();
            }

            let i = _.findIndex(occurenceDomains, {'domain': sub.data.domain});

            if(_.includes(uniqDomains, sub.data.domain)) {
              occurenceDomains[i].occurence++;
              occurenceDomains[i].dates.push(fetchDate);
              return next();
            }

            uniqDomains.push(sub.data.domain);

            occurenceDomains.push({
              domain: sub.data.domain,
              occurence: 1,
              dates: [fetchDate]
            });

            next();

          }, (err) => {

            if(err) {
              return callback(err);
            }

            callback(null, after);

          });

        });

      },
      (err) => {
        if(err) {
          return res.json(err);
        }

        res.json(_.reverse(_.sortBy(occurenceDomains, 'occurence')));
      }
    );


  });

  return domain;

};