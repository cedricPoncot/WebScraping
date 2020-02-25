function test(){
	console.log(readJson);
}
var json = require('C:\Users\cponcot\Desktop\InitRecherche\WebScraping-master\db.json');
var readJson = (path, cb) => {
  fs.readFile(require.resolve(path), (err, data) => {
    if (err)
      cb(err)
    else
      cb(null, JSON.parse(data))
  })
}