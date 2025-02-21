import categorySeeder from "./category.js"
import productSeeder from "./product.js"
import mongoConnect from '../mongo/mongoConnecter.js';
async function seeder() {
   await mongoConnect();
console.log("start seeder category")
await categorySeeder()
console.log("end seeder category")
await productSeeder()
console.log("end seeder category")
process.exit(0);
}
seeder()