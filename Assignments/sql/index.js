const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');


app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'store',
    user: 'root',
    password: 'root',
})

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MySQL database.');
    }
})

// suppliers routes
app.post('/suppliers', (req, res, next) => {
    const { supplier_name, contactNumber } = req.body;

    const queryCheck = `select * from suppliers where s_ContactNumber=?`;
    connection.execute(queryCheck, [contactNumber], (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Database error", error: err });
        }
        if (results.length > 0) {
            return res.status(400).send({ message: "Supplier with this contact number already exists" });
        } else {
            const query = `insert into suppliers (s_supplierName,s_ContactNumber) values (?,?)`
            connection.execute(query, [supplier_name, contactNumber], (err, results) => {
                if (err) {
                    return res.status(500).send({ message: "Database error", error: err });
                }
                return res.status(201).send({ message: "Supplier created successfully", supplierId: results.insertId });
            })
        }

    })

})

// add product for a supplier
app.post(`/products/add/:supplierId`, (req, res, next) => {
    const { supplierId } = req.params;
    const { productName, productPrice, productStock } = req.body
    const queryCheckSupplier = `select * from suppliers where s_supplierId=?`;
    connection.execute(queryCheckSupplier, [supplierId], (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Database error", error: err });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: "Supplier not found" });
        } else {
            const queryAddProduct = `insert into product (p_productName,p_price,p_stockQuantity	,	p_supplierID) values (?,?,?,?)`
            connection.execute(queryAddProduct, [productName, productPrice, productStock, supplierId], (err, results) => {
                if (err) {
                    return res.status(500).send({ message: "Database error", error: err });
                }
                return res.status(201).send({ message: "Product added successfully", productId: results.insertId });
            })
        }
    })
})

// sale product
app.post(`/products/sale/:productId`, (req, res, next) => {
    const { productId } = req.params;
    const { quantitySale, saleDate } = req.body;
    const queryCheckProduct = `select * from product where p_id=?`;
    connection.execute(queryCheckProduct, [productId], (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Database error", error: err });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: "Product not found" });
        } else {
            const querySaleProduct = `insert into sales (s_quantitySold,s_salesDate,s_productID) values (?,?,?)`
            connection.execute(querySaleProduct, [quantitySale, saleDate, productId], (err, results) => {
                if (err) {
                    return res.status(500).send({ message: "Database error", error: err });
                }
                return res.status(201).send({ message: "Product sale recorded successfully", saleId: results.insertId });
            })
        }
    })
})

// update price of a product
app.patch(`/products/update/:productId`, (req, res, next) => {
    const { productId } = req.params;
    const { newPrice } = req.body;
    const queryCheckProduct = `select * from product where p_id=?`;
    connection.execute(queryCheckProduct, [productId], (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Database error", error: err });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: "Product not found" });
        } else {
            const queryUpdatePrice = `update product set p_price=? where p_id=?`
            connection.execute(queryUpdatePrice, [newPrice, productId], (err, results) => {
                if (err) {
                    return res.status(500).send({ message: "Database error", error: err });
                }
                return res.status(200).send({ message: "Product price updated successfully" });
            })
        }
    })
})

// delete product

app.delete(`/products/delete/:productId`, (req, res, next) => {
    const { productId } = req.params;
    const queryCheckProduct = `select * from product where p_id=?`;
    connection.execute(queryCheckProduct, [productId], (err, results) => {
        if (err) {
            return res.status(500).send({ message: "Database error", error: err });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: "Product not found" });
        } else {
            const queryDeleteProduct = `delete from product where p_id=?`
            connection.execute(queryDeleteProduct, [productId], (err, results) => {
                if (err) {
                    return res.status(500).send({ message: "Database error", error: err });
                }
                return res.status(200).send({ message: "Product deleted successfully" });
            })
        }
    })
})

// get total sold for all product 
app.get(`/product/totalSold`, (req, res, next) => {
    const query = `select p.p_id AS productID,p.p_productName As productName, COALESCE(sum(s.s_quantitySold),0) as totalSold from product p left join sales s on p.p_id=s.s_productID group by p.p_id,p.p_productName`
    connection.execute(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        return res.status(200).json({ message: "Total sold data retrieved successfully", data: results });
    })
})
// if productQuantitySold = 0 value will be null now use COALESCE to set it to 0

// 10-Get the product with the highest stock.

app.get(`/product/highestStock`, (req, res, next) => {
    const query = `select * from product order by p_stockQuantity DESC limit 1`
    connection.execute(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        return res.status(200).json({ message: "Product with highest stock retrieved successfully", data: results[0] });
    })
})

// 11-Find suppliers with names starting with 'F'. (0.5 Grade)
app.get(`/suppliers/startsWithF`, (req, res, next) => {
    const query = `select * from suppliers where s_supplierName LIKE 'F%'`
    connection.execute(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        return res.status(200).json({ message: "Suppliers with names starting with 'F' retrieved successfully", data: results });
    })
})

// 12-Show all products that have never been sold.
app.get(`/products/neverSold`, (req, res, next) => {
    const query = `select p.* from product p left join sales s on p.p_id=s.s_productID where s.s_productID is null`
    connection.execute(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        return res.status(200).json({ message: "Products that have never been sold retrieved successfully", data: results });
    })
})

// 13-Get all sales along with product name and sale date. (0.5 Grade)


app.get(`/sales/details`, (req, res, next) => {
    const query = `SELECT p.p_productName as ProductName, s.s_quantitySold as QuantitySold, s.s_salesDate as SaleDate FROM sales s JOIN product p ON s.s_productID = p.p_id`
    connection.execute(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        return res.status(200).json({ message: "Sales details retrieved successfully", data: results });
    })

})

// 14-Create a user “store_manager” and give them SELECT, INSERT, and UPDATE permissions on all tables. (0.5 Grade)
app.post(`/createStoreManager`, (req, res, next) => {
    const queryCreateUser = `CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'FAKHR_BASHA'`
    connection.execute(queryCreateUser, [], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        const queryGrantPermissions = `GRANT SELECT, INSERT, UPDATE ON store.* TO 'store_manager'@'localhost';`
        connection.execute(queryGrantPermissions, [], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }
            return res.status(201).json({ message: "User 'store_manager' created and permissions granted successfully" });
        })
    })
})

// / 15-Revoke UPDATE permission from “store_manager”. (0.5 Grade)

app.post(`/revokeUpdateStoreManager`, (req, res, next) => {
    const query = `revoke update on store.* from 'store_manager'@'localhost'`
    connection.execute(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        const queryShowGrants = `SHOW GRANTS FOR 'store_manager'@'localhost'`
        connection.execute(queryShowGrants, [], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }
            return res.status(200).json({ message: "UPDATE permission revoked from 'store_manager' successfully", grants: results });
        })

    })
})

// 16-Grant DELETE permission to “store_manager” only on the Sales table. (0.5 Grade)
app.post(`/grantDeleteStoreManager`, (req, res, next) => {
    const query = `GRANT DELETE ON store.sales TO 'store_manager'@'localhost'`
    connection.execute(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        const queryShowGrants = `SHOW GRANTS FOR 'store_manager'@'localhost'`
        connection.execute(queryShowGrants, [], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }
            return res.status(200).json({ message: "DELETE permission granted to 'store_manager' on Sales table successfully", grants: results });
        })
    })
})

app.get('/', (req, res, next) => {
    return res.status(200).send({ message: "Welcome to the API" });
})

app.use(`{/*demo}`, (req, res, next) => {
    return res.status(404).send({ message: "This route is Not Found" });
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})