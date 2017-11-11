# FE developer test task

Please follow the instructions to complete the test task. We have provided you files which should be used in your localhost folder called "myjar".

  - Use your favourite local server engine
  - VCS usage is obligatory!
  - When finished, inform us. Provide link to finished task repo.

### Instructions

If you open the index.html file you will see our loan request page for 1 month product. Your test task requires to add tabbing functionality to the top of the container which allows switching the content of the container.

Exact file base for the container is located at myjar/angular-app/client/overview. You can use css /myjar/angular-css/client.css or SCSS myjar/scss/client.scss and compile it.

#####Back-end instruction

  - Use your favourite  PHP framework (we use Laravel) or create PHP file to respond to the API call from front-end. 
  - Create API to respond products (1, 2 and 3 months) and each array of the product contains: Product name and interest per day.

#####Front-end instructions

  - Create tabbing functionality on top of the container. See [example-tabs.png]
  - There will be 3 tabs in total and each tab represents a product (Tabs: 1 month, 2 months, 3 months) 
  - 2 and 3 month products don't have a day slider (only amount slider) and instead of a duration value (eg. "30 Days") they have fixed string name "2 Months" or "3 Months". See [2month-product.png]
  - Change the main container and inner left side "slider" container backgrounds to the following color combinations: 2 months is green and 3 months is yellow. Tabs should match the colors.
  - Tabs should be dynamically generated based on API response (See Back-end instructions).

### Thank you!
