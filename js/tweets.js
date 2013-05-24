/** Reuses code from http://www.queness.com/post/10778/create-a-twitter-feed-with-hash-tag-and-cache-support */
JQTWEET = {
    numTweets: 10, //number of tweets
    cacheExpiry: 2, //get the new cache in 2 hours
    appendTo: '#jstwitter',
    loadTweets: function() {
        var request = {
            expiry: JQTWEET.cacheExpiry
        };

        $.ajax({
            url: 'tweets.php',
            type: 'GET',
            dataType: 'json',
            data: request,
            success: function(data, textStatus, xhr) {
            var tweetdata, user, html = '<table class="table table-condensed"><tr><td width="60px"><img class="thumbnail" src="IMAGE_URL" alt="user"/></td><td style="vertical-align:middle">TWEET_TEXT<br/>AGO by USER</td></tr></table>';
                try {  
                    for (var i = 0; i < data.length && i < JQTWEET.numTweets; i++) {
                        if (data[i].retweeted_status){
                            tweetdata = data[i].retweeted_status;
                            user = tweetdata.user.screen_name + ", retweeted by AustESE";
                        } else {
                            tweetdata = data[i];
                            user = tweetdata.user.screen_name;
                        }


                        $(JQTWEET.appendTo).append( 
                            html.replace('TWEET_TEXT', JQTWEET.ify.clean(tweetdata.text))
                                .replace(/USER/g, user)
                                .replace('IMAGE_URL',tweetdata.user.profile_image_url)
                                .replace('AGO', JQTWEET.timeAgo(tweetdata.created_at))
                        );
                    } 
                } catch (e) {
                    // no data
                }
            }
        });
    },

    /**
      * relative time calculator FROM TWITTER
      * @param {string} twitter date string returned from Twitter API
      * @return {string} relative time like "2 minutes ago"
      */
    timeAgo: function(dateString) {
        var rightNow = new Date();
        var then = new Date(dateString);
         
        if ($.browser.msie) {
            // IE can't parse these crazy Ruby dates
            then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
        }
 
        var diff = rightNow - then;
 
        var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;
 
        if (isNaN(diff) || diff < 0) {
            return ""; // return blank string if unknown
        }
 
        if (diff < second * 2) {
            // within 2 seconds
            return "right now";
        }
 
        if (diff < minute) {
            return Math.floor(diff / second) + " seconds ago";
        }
 
        if (diff < minute * 2) {
            return "about 1 minute ago";
        }
 
        if (diff < hour) {
            return Math.floor(diff / minute) + " minutes ago";
        }
 
        if (diff < hour * 2) {
            return "about 1 hour ago";
        }
 
        if (diff < day) {
            return  Math.floor(diff / hour) + " hours ago";
        }
 
        if (diff > day && diff < day * 2) {
            return "yesterday";
        }
 
        if (diff < day * 365) {
            return Math.floor(diff / day) + " days ago";
        }
 
        else {
            return "over a year ago";
        }
    }, // timeAgo()
     
     
    /**
      * The Twitalinkahashifyer!
      * http://www.dustindiaz.com/basement/ify.html
      * Eg:
      * ify.clean('your tweet text');
      */
    ify:  {
      link: function(tweet) {
        return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
          var http = m2.match(/w/) ? 'http://' : '';
          return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
        });
      },
 
      at: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
        });
      },
 
      list: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
        });
      },
 
      hash: function(tweet) {
        return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
          return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
        });
      },
 
      clean: function(tweet) {
        return this.hash(this.at(this.list(this.link(tweet))));
      }
    } // ify
 
     
};
 
 
 
$(document).ready(function () {
    // start jqtweet!
    JQTWEET.loadTweets();
});