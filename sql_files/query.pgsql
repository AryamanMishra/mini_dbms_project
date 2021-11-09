
-- This file is just for writing and storing queries and making new tables in the database 
-- This file is not running anywhere



create table customer(
    customer_id varchar primary key,
    name varchar not null,
    phone_no varchar not null,
    address varchar not null,
    cart_id varchar not null,
    password varchar not null,
    email_id varchar not null,
    foreign key(cart_id)
    references cart(cart_id)
)
select * from customer



create table cart(
    cart_id varchar primary key,
	total_cost float
)
select * from cart
delete from cart


create table transaction(
    transaction_id varchar primary key,
    transaction_date timestamp not null,
    total_amount float not null,
    customer_id varchar not null,
    cart_id varchar not null,
    foreign key(customer_id)
    references customer(customer_id),
    foreign key(cart_id)
    references cart(cart_id)
)
select * from transaction
delete from transaction


create table cart_item (
    product_id varchar not null,
    cart_id varchar not null,
    quantity int not null,
    foreign key(product_id)
    references product(product_id),
    foreign key(cart_id)
    references cart(cart_id)
)
select * from cart_item
delete from cart_item


create table product(
    product_id varchar primary key,
    product_name varchar not null,
    category_id varchar not null ,
    brand varchar ,
    price float not null,
    discount float ,
    availability boolean not null,
    foreign key(category_id) 
    references category(category_id)
)
select * from product




create table category(
    category_id varchar primary key,
	category_name varchar not null
)
select * from category



create table order_details (
    order_id varchar primary key,
    order_date date not null,
    customer_id varchar not null,
    product_id varchar not null,
    total_price float not null,
    total_discount float not null,
    transaction_id varchar not null,
    cart_id varchar not null,
    foreign key(customer_id) references customer(customer_id),
    foreign key(transaction_id) references transaction(transaction_id),
    foreign key(product_id) references product(product_id),
    foreign key(cart_id) references cart(cart_id) 
)
select * from order_details




create table seller(
    seller_id varchar primary key,
    dealer_name varchar not null,
    phone_no int not null,
    email_id varchar not null,
    category_id varchar not null,
    foreign key(category_id) 
    references category(category_id)
)
select * from seller 


create table reviews(
    review_id varchar primary key,
    customer_id varchar not null,
    product_id varchar not null,
    date timestamp not null,
    rating float not null,
    review varchar not null,
    foreign key(customer_id) references customer(customer_id),
    foreign key(product_id) references product(product_id)
)
select * from reviews

