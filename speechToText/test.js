const prompt = require('prompt-sync')();

const arr = [
    'We sell engine oil and spare partts',
    'Car light is 200gh',
    'Cost of renting Benz is between 500gh to 700gh'
]

const input = prompt('Search: ');

if(input.includes('benz')){
    console.log(arr[2])
}