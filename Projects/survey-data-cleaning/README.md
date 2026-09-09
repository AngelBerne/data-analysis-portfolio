# Customer Survey Data Cleaning & Analysis — MySQL

## 📊 Project Overview

This project focuses on cleaning, transforming, and analyzing a customer survey dataset using **MySQL**.

The original dataset contained several common data-quality problems, including:

* Inconsistent text values
* Missing contact information
* Incorrect date values
* Unstructured address data
* Duplicate survey records
* Missing satisfaction ratings
* Inconsistent service feedback

The goal was to transform the raw survey data into a cleaner and more structured dataset that could be used for analysis and reporting.

---

## 🛠️ Tools & Technologies

* **MySQL**
* SQL
* Window Functions
* CTEs (Common Table Expressions)
* String Functions
* Date Functions
* Aggregate Functions
* Data Cleaning & Transformation

---

# 🔎 Data Cleaning Process

## 1. Create a Clean Working Table

Instead of modifying the original `survey` table, I created a copy for cleaning and transformation.

```sql
CREATE TABLE survey_clean AS
SELECT *
FROM survey;
```

This preserves the original dataset while allowing the cleaning process to be performed separately.

---

## 2. Standardize Rewards Member Values

The `rewards_member` column contained inconsistent capitalization.

The goal was to standardize the values.

```sql
SELECT rewards_member
FROM survey_clean;
```

The values were then transformed into a consistent format.

> Note: `INITCAP()` is not available in standard MySQL, so the exact implementation depends on the desired capitalization format.

---

## 3. Standardize Service Feedback

The `service_feedback` column contained variations and misspelled/incomplete values.

For example, different values could represent:

* Excellent
* Average
* Good
* Poor

A `CASE` expression was used to standardize these responses.

```sql
UPDATE survey_clean
SET service_feedback =
    CASE
        WHEN service_feedback LIKE '%xcell%' THEN 'Excelente'
        WHEN service_feedback LIKE '%ave%' THEN 'Average'
        WHEN service_feedback LIKE '%ood%' THEN 'Good'
        WHEN service_feedback LIKE '%oor%' THEN 'Poor'
        WHEN service_feedback LIKE '%rea%' THEN 'Good'
    END;
```

This demonstrates how SQL can be used to normalize inconsistent categorical data.

---

## 4. Clean Survey Dates

One incorrect date was identified and corrected.

```sql
UPDATE survey_clean
SET survey_date = '2026-01-06'
WHERE customer_id = 3;
```

The date column was then converted to the appropriate date format.

```sql
UPDATE survey_clean
SET survey_date = CAST(survey_date AS DATE);
```

---

# 📍 5. Split Address Data

The original `address` column contained multiple pieces of information in a single field.

Example:

```text
123 Main Street, Boston, MA
```

The address was separated into:

* `street`
* `city`
* `state`

New columns were added:

```sql
ALTER TABLE survey_clean
ADD COLUMN street VARCHAR(30),
ADD COLUMN city VARCHAR(30),
ADD COLUMN state VARCHAR(30);
```

The values were extracted using `SUBSTRING_INDEX()`.

```sql
UPDATE survey_clean
SET
    street = SUBSTRING_INDEX(address, ',', 1),
    city = SUBSTRING_INDEX(
        SUBSTRING_INDEX(address, ',', -2),
        ',',
        1
    ),
    state = SUBSTRING_INDEX(address, ',', -1);
```

This transformation makes geographic information easier to analyze.

---

# 📞 6. Create a Contact Information Column

The dataset contained separate `email` and `phone` columns.

A new `point_contact` column was created:

```sql
ALTER TABLE survey_clean
ADD COLUMN point_contact VARCHAR(30);
```

`COALESCE()` was used to select the first available contact method.

```sql
UPDATE survey_clean
SET point_contact =
    COALESCE(email, phone, 'Unknown');
```

This provides a single field that can be used to identify the customer's available contact information.

---

# ♻️ 7. Identify and Remove Duplicate Surveys

Duplicate survey records were identified using a window function.

The following fields were used to determine whether two records represented the same survey:

* Customer ID
* Street
* Contact information
* Survey date

```sql
WITH getDuplicate AS (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY
                   customer_id,
                   street,
                   point_contact,
                   survey_date
               ORDER BY survey_date DESC
           ) AS num_survey
    FROM survey_clean
)
```

Only the first record from each duplicate group was retained.

```sql
CREATE TABLE survey_clean2 AS

WITH getDuplicate AS (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY
                   customer_id,
                   street,
                   point_contact,
                   survey_date
               ORDER BY survey_date DESC
           ) AS num_survey
    FROM survey_clean
)

SELECT
    customer_id,
    point_contact,
    street,
    city,
    state,
    rewards_member,
    survey_date,
    survey_time,
    satisfaction_rating,
    service_feedback,
    product_quality,
    recommend_to_friend,
    freetext_response
FROM getDuplicate
WHERE num_survey < 2;
```

### Why use `ROW_NUMBER()`?

`ROW_NUMBER()` assigns a sequential number to each record within a duplicate group.

For example:

| customer_id | survey_date | num_survey |
| ----------: | ----------- | ---------: |
|         106 | 2026-01-10  |          1 |
|         106 | 2026-01-10  |          2 |

Filtering with:

```sql
WHERE num_survey < 2
```

keeps only the first record.

---

# 🧹 8. Handle Missing Satisfaction Ratings

Missing satisfaction ratings were replaced with `0`.

```sql
UPDATE survey_clean2
SET satisfaction_rating = COALESCE(satisfaction_rating, 0);
```

This allows the column to be used in subsequent calculations without leaving `NULL` values.

---

# 📈 Exploratory Data Analysis

After cleaning the dataset, SQL was used to explore customer survey patterns.

---

## Rewards Membership by City

The number and percentage of customers were calculated by city and rewards membership status.

```sql
SELECT
    city,
    rewards_member,
    COUNT(rewards_member) AS result,
    COUNT(rewards_member) /
        (SELECT COUNT(*) FROM survey_clean2) * 100 AS percentage
FROM survey_clean2
GROUP BY city, rewards_member;
```

This helps identify the distribution of rewards members across different cities.

---

## Satisfaction Rating vs. Service Feedback

The relationship between satisfaction ratings and service feedback was also explored.

```sql
SELECT
    satisfaction_rating,
    service_feedback,
    COUNT(satisfaction_rating) AS result,
    COUNT(satisfaction_rating) /
        (SELECT COUNT(*) FROM survey_clean2) * 100 AS percentage
FROM survey_clean2
GROUP BY
    satisfaction_rating,
    service_feedback;
```

This can help identify patterns between numerical satisfaction scores and customers' qualitative feedback.

---

# 🧠 SQL Concepts Demonstrated

This project demonstrates practical use of:

### Data Cleaning

* `UPDATE`
* `CASE`
* `COALESCE()`
* `CAST()`
* String manipulation
* Handling missing values

### Data Transformation

* `ALTER TABLE`
* Creating derived columns
* Splitting structured information from text

### Data Deduplication

* `ROW_NUMBER()`
* `PARTITION BY`
* Common Table Expressions

### Data Analysis

* `COUNT()`
* `GROUP BY`
* Percentage calculations
* Window functions
* Aggregation

---

# 📌 Key Learning

One of the main lessons from this project was that **data analysis starts with data quality**.

Before asking questions about customers, satisfaction, or business performance, the dataset needs to be examined for:

1. Missing values
2. Duplicate records
3. Incorrect dates
4. Inconsistent categories
5. Unstructured fields
6. Formatting problems

SQL provides powerful tools to perform these transformations directly inside the database.

---

# 🚀 Future Improvements

Possible improvements to this project include:

* Create a data-quality report before and after cleaning
* Analyze missing values by column
* Investigate outliers in satisfaction ratings
* Calculate average satisfaction by city
* Compare rewards members vs. non-members
* Analyze recommendation rates
* Identify customers with consistently negative feedback
* Build a dashboard using **Power BI** or **Tableau**
* Connect the cleaned SQL dataset to Python for deeper analysis

---

## 📂 Project Structure

```text
survey-data-cleaning/
│
├── README.md
├── survey_data_cleaning.sql
├── survey_dataset_messy.csv
└── survey.sql
```


---

## 🎯 Project Objective

The objective of this project was to demonstrate the ability to take a raw dataset, identify common data-quality problems, clean and transform the data using SQL, and prepare it for meaningful analysis.

This project represents a practical example of the type of data-cleaning and exploratory work commonly performed in a **Data Analyst** role.
