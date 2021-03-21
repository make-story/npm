const fs = require('fs');
const path = require('path');
const package = require(path.resolve(__dirname, '../package.json'));

/*let data = null;
if(!fs.existsSync('package.json')) {
    data = fs.readFileSync(filepath);
}*/
package.version = '1.1.1';

fs.writeFileSync(
    path.resolve(__dirname, '../package.json'), 
    JSON.stringify(Object.assign({}, package)/*믹스인*/, null, 2), 
    function(error) { 
        console.log(error);
    }
);