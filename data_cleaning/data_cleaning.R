library(jsonlite)
library(tidyverse)

# Read the json file using jsonlite
data <- fromJSON('sample_data.json') |> 
  # Select columns of interest
  select(participant_id, response) |> 
  # Remove the first row since it's the instruction trial
  slice(-1, -2) |> 
  # Un-nest the nested lists (they make sense in json but not in a data frame)
  unnest_longer(col = c(response)) |> 
  # Give the new column a meaningful name
  rename(question = response_id) |> 
  # Extract question block and number from joint column
  mutate(question_block = substr(question, 2,2),
         question_nr = substr(question, 4,4)) |> 
  # Drop the joint column
  select(-question) |> 
  # And then reorder the columns to make the data frame more intuitive
  relocate(response, .after =  question_nr)

# Print the head of the tidy data frame on the console
head(data)
