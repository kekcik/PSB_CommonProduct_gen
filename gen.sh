git clone https://github.com/kekcik/PSB_CommonProduct_gen &> /dev/null 
wait
cd PSB_CommonProduct_gen
npm i ncp replace-in-file readline mkdirp &> /dev/null
wait
node main.js
wait
cd ..
rm -rf Result
cp -R PSB_CommonProduct_gen/Result/. .
rm -rf PSB_CommonProduct_gen
