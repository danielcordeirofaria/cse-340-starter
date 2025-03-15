INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );


UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
AND account_lastname = 'Stark';

DELETE FROM public.account
WHERE account_firstname = 'Tony'
AND account_lastname = 'Stark';


UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
AND inv_model = 'Hummer';


SELECT 
    inv.inv_make,
    inv.inv_model,
    class.classification_name
FROM 
    inventory inv
INNER JOIN 
    classification class
ON 
    inv.classification_id = class.classification_id
WHERE 
    class.classification_name = 'Sport';



ALTER TABLE inventory
ADD COLUMN IF NOT EXISTS inv_image text,
ADD COLUMN IF NOT EXISTS inv_thumbnail text;

UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
