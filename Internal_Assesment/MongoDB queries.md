1. Demonstrate the usage of $match, $group, aggregate pipelines.

       a.match: Selects the records that match with the specified condition.

           db.movieDetails.aggregate([{ $match : { movieName:"Soul" }}]).pretty()

       b.group: Groups input documents by the specified _id.

           db.movieDetails.aggregate([{$group:{_id:"$Genre" , count: {$sum:1 }}}]).pretty()

       c.aggregate:match and group

          db.movieDetails.aggregate([{$match:{"IMDB rating":{$gt:8.5}}},{$group:{_id:"$Genre" , count:{$sum:1}}}]).pretty()
        
        
        
2. Demonstrate the Map-Reduce aggregate function on this dataset.

        var mapFunc = function(){emit(this.Genre,this["IMDB rating"]);};
        var reducerFunc = function(genre,rating){ return Array.avg(rating);};
        db.movieDetails.mapReduce(mapFunc,reducerFunc,{out:"prg2out"}) ;
      
3. Count the number of Movies which belong to the thriller category and find out the total number of positive reviews in that category.
      
        db.movieDetails.aggregate([{$match:{"Genre":"Thriller"}},{$group:{_id:"Genre",count:{$sum:1},value:{$sum:"Positive feedbacks"}}}]).pretty()
      
4. Group all the records by genre and find out the total number of positive feedbacks by genre.
 
        db.movieDetails.aggregate([{$group:{_id:"$Genre",count:{$sum:1},Total_number_of_positive_feedbacks:{$sum:"$Positive feedbacks"}}}]).pretty()

        
         

