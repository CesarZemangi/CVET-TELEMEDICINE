import sequelize from \"./src/config/db.js\";  
const checkCases = async () = 
try {  
const [rows] = await sequelize.query(\"SELECT * FROM cases LIMIT 1\");  
console.log('CASES TABLE:', JSON.stringify(rows, null, 2));  
process.exit(0);  
} catch (err) {  
console.error(err);  
process.exit(1);  
}  
};  
checkCases();  
