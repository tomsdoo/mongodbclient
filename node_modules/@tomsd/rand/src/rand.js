/**
 * @license rand
 * (c) 2019 tom
 * License: MIT
*/
function range(n,s){let r = []; for(let i = 0; i < n; i++){r.push(i +(s?s:0));} return r;}
function randc(){return String.fromCharCode(("a").charCodeAt(0)+Math.floor(Math.random()*26));}
function rands(l){return range(l ? l : 5).map(randc).join("");}
function randid(s){return [(s ? s : ""), rands(), (new Date()).getTime()].join("");}

export default {char:randc, str:rands, id:randid};
