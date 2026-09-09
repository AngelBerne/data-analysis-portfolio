SELECT * FROM survey;

DROP TABLE survey_clean;
-- create a table with old one
CREATE TABLE survey_clean as
(SELECT  * FROM survey);



-- rewards_member clean
SELECT rewards_member , INITCAP(rewards_member) as rewards_member_c FROM survey_clean;
UPDATE survey_clean
SET rewards_member = INITCAP(rewards_member);

-- service_feedback

UPDATE survey_clean
SET service_feedback = 
	case
  WHEN service_feedback like "%xcell%" then "Excelente"
  WHEN service_feedback like "%ave%" then "Average"
  WHEN service_feedback like "%ood%" then "Good"
  WHEN service_feedback like "%oor%" then "Poor"
   WHEN service_feedback like "%rea%" then "Good"
  end ;
  
  
SELECT service_feedback FROM survey;

-- DATE
UPDATE survey_clean
SET survey_date = "2026-01-06"
WHERE customer_id = 3;

UPDATE survey_clean
SET survey_date = cast(survey_date as date);

SELECT * FROM survey_clean;

-- address

SELECT 
substring_index(address , ",",1) as street,
substring_index(substring_index(address , ",",-2),",",1) as city,
substring_index(address , ",",-1) as state
FROM survey_clean;
  
ALTER TABLE survey_clean
ADD COLUMN street VARCHAR(30),
ADD COLUMN city VARCHAR(30),
ADD COLUMN state VARCHAR(30);

UPDATE survey_clean
SET street = substring_index(address , ",",1),
city = substring_index(substring_index(address , ",",-2),",",1),
state = substring_index(address , ",",-1);
  
  
-- point_contact

ALTER TABLE survey_clean
ADD COLUMN point_contact VARCHAR(30);

SELECT email , phone , coalesce(email , phone , "Unknow") FROM survey_clean;
UPDATE survey_clean
SET point_contact = coalesce(email , phone , "Unknow");


-- REMOVE DUPLICATE
-- customer 106
SELECT DISTINCT COUNT(customer_id) FROM survey_clean;



CREATE TABLE  survey_clean2 as
WITH getDuplicate as( SELECT * , 
ROW_NUMBER() OVER(PARTITION by customer_id , street, point_contact, survey_date  ORDER BY survey_date DESC) 
as num_survey  
FROM survey_clean
)

SELECT customer_id , point_contact, street, city, state, rewards_member,survey_date, 
survey_time , satisfaction_rating,service_feedback, product_quality, recommend_to_friend, freetext_response

FROM getDuplicate
WHERE num_survey < 2
ORDER BY CAST(customer_ID as SIGNED)
;

SELECT * FROM survey_clean;

SELECT * FROM survey_clean2;

UPDATE survey_clean2
SET satisfaction_rating = coalesce(satisfaction_rating,0);

SELECT * ,
DENSE_RANK() OVER(partition by rewards_member  order by city  )

FROM survey_clean2;



SELECT city ,rewards_member , count(rewards_member) result , count(rewards_member)/ (SELECT count(*) FROM survey_clean2) * 100 porsentage  
FROM survey_clean2
GROUP BY city , rewards_member
;


SELECT city ,rewards_member , count(rewards_member) result , count(rewards_member)/ (SELECT count(*) FROM survey_clean2) * 100 porsentage  
FROM survey_clean2
GROUP BY city , rewards_member
;

SELECT satisfaction_rating, service_feedback , count(satisfaction_rating) result , count(satisfaction_rating)/ (SELECT count(*) FROM survey_clean2) * 100 porsentage  
FROM survey_clean2
GROUP BY  satisfaction_rating ,service_feedback
;

SELECT * FROM survey_clean2;