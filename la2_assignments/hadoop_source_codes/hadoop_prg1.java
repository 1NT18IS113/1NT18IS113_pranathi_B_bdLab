package my.pack.prg1;

import java.io.IOException;
import java.util.*;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.*;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapred.*;
import org.apache.hadoop.util.*;



public class prg1 {
	//MAPPER CODE	
	   
		public static class Map extends MapReduceBase implements Mapper<LongWritable, Text, Text, IntWritable> {
		private final static IntWritable one = new IntWritable(1);
		

		public void map(LongWritable key, Text value, OutputCollector<Text, IntWritable> output, Reporter reporter) throws IOException {
			String myvalue = value.toString() ;
			String[] transactiontokens = myvalue.split(",") ;
			if(transactiontokens[5].contentEquals("YES")) {     //collect values if value is YES
				output.collect(new Text(transactiontokens[5]), one);
			}
			));
		}
		}

		//REDUCER CODE	
		public static class Reduce extends MapReduceBase implements Reducer<Text, IntWritable, Text, IntWritable> {
		public void reduce(Text key, Iterator<IntWritable> values, OutputCollector<Text, IntWritable> output, Reporter reporter) throws IOException { //{little: {1,1}} 
			Text t_key = key ;
			int sum=0 ;
			while (values.hasNext()) {
				IntWritable value = (IntWritable) values.next() ;
				sum += value.get();
		       	}
			output.collect(new Text("Number of employees eligible for pay rise : "), new IntWritable(sum));
			}	
		}
		
			
		//DRIVER CODE
		public static void main(String[] args) throws Exception {
			JobConf conf = new JobConf(prg1.class);
			conf.setJobName("Counting the Number of Employees eligible for payrise");
			conf.setOutputKeyClass(Text.class);
			conf.setOutputValueClass(IntWritable.class);
			conf.setMapperClass(Map.class);
			conf.setCombinerClass(Reduce.class);
			conf.setReducerClass(Reduce.class);
			conf.setInputFormat(TextInputFormat.class);
			conf.setOutputFormat(TextOutputFormat.class); // hadoop jar jarname classpath inputfolder outputfolder
			FileInputFormat.setInputPaths(conf, new Path(args[0]));
			FileOutputFormat.setOutputPath(conf, new Path(args[1]));
			JobClient.runJob(conf);   
		}
		}

