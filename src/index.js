import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, child, set, get, remove } from 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyArN0C2C3486hVfwsWs6YPswc9PGOPQSzU",
  authDomain: "doit-2255.firebaseapp.com",
  projectId: "doit-2255",
  storageBucket: "doit-2255.appspot.com",
  messagingSenderId: "361829619072",
  appId: "1:361829619072:web:06ea71945b80f813035d65",
  measurementId: "G-BVKZNLZB6Z",
  databaseURL: "https://doit-2255-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
var totalamt=0, income=0, expense=0;
var root = document.querySelector(':root');
window.onload = function () {
  setup();
  setcol();
  setslidersettings();
  showhide('addnewpopup');
  showhide('userpopup');
  showhide('settingspopup');
  showhide('editpopup');
  setfont();
  setuser();
  addqueryselectors();
  addeventlistners();
  setTimeout(function () {
  document.getElementById('loader').remove();
  },1000);
}
function addnewpopupshow(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  id('newitemdate').value = today;
  
}
function setup(){
  id('expenceamt').innerHTML=0;
  id('incomeamt').innerHTML=0;
  id('totalamt').innerHTML=0;
  // set the current date in the input field newitemdate
}
function id(idname) {
  var id = document.getElementById(idname);
  return id;
}
function showhide(popup) {
  var popup = id(popup);
  var duration = parseInt(getComputedStyle(document.querySelector(':root')).getPropertyValue('--transdur'));
  var animstyle = getComputedStyle(document.querySelector(':root')).getPropertyValue('--animstyle');

  if (popup.style.visibility == "hidden") {
    popup.style.visibility = "visible";
    popup.style.display = "block";
    popup.style.animation = " showMe " + duration + "ms " + animstyle;
  }
  else{
  popup.style.animation = " hideMe " + duration + "ms " + animstyle;
  popup.style.visibility = "hidden";
  setTimeout(function () {
    popup.style.display = "none";
      }, duration/3);
}
}
function addeventlistners() {
  id('signinoutbtn').addEventListener('click', function () {showhide('userpopup');});
  id('settingsbtn').addEventListener('click', function () { showhide('settingspopup'); });
  id('addnew').addEventListener('click', function () {  addnewpopupshow(); showhide('addnewpopup'); });
  id('signinout').addEventListener('click', function () { signinout(); });
  id('submitbtn').addEventListener('click', function () { submitit(); });
  id('submiteditbtn').addEventListener('click', function () { submiteditit(); });
  id('canclbtn').addEventListener('click', function () { canceltodo(); });
  id('cancleditbtn').addEventListener('click', function () { canceledittodo(); });
  id('cancelset').addEventListener('click', function () { showhide('settingspopup'); });
  id('transdur').addEventListener('change', function () { changevalue(this, 'transdur', 'ms', 10); });
  id('bordrad').addEventListener('change', function () { changevalue(this, 'bordrad', 'px', 1); });
  id('fontchanger').addEventListener('change', function () { changefont(); });
}
function addqueryselectors() {
  const editbtns = document.querySelectorAll('.itemedit');
  editbtns.forEach(btn => {
    btn.addEventListener('click', function () {
      edittodo(this.parentElement.id);
    })
  });
  const delbtns = document.querySelectorAll('.itemdel');
  delbtns.forEach(btn => {
    btn.addEventListener('click', function () {
      deletetodo(this.parentElement.id);
    })
  });
  const valuebtns=document.querySelectorAll('.valuechander');
  valuebtns.forEach(btn=>{
    btn.addEventListener('change',function(){
      changevalue(this,this.id,'vh',0.007);
    })
  });
  const colorbtns=document.querySelectorAll('.colorchanger');
  colorbtns.forEach(btn=>{
    btn.addEventListener('change',function(){
      changecol(this,this.id);
    })
  });

}
function signinout() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    'login_hint': 'user@example.com',
    'prompt': 'select_account',
  });
  if (auth.currentUser) {
    id('signinout').innerHTML = "Sign in";
    auth.signOut();
    return;
  }
  signInWithPopup(auth, provider)
    .then(result => {
      // set the user's display name and image in the UI
      id('username').innerHTML = result.user.displayName;
      id('userimg').src = result.user.photoURL;
      id('signinoutbtn').src = result.user.photoURL;
      id('signinout').innerHTML = "Sign out";
      showhide('userpopup');
      restoredata();

    }
    )
    .catch(error => {
      console.log(error);
    }
    );

}
function setuser() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      id('username').innerHTML = user.displayName;
      id('userimg').src = user.photoURL;
      id('signinoutbtn').src = user.photoURL;
      id('signinout').innerHTML = "Sign out";
      restoredata();

    } else {
      id('username').innerHTML = 'guest';
      id('userimg').src = '../res/defuser.webp';
      id('signinoutbtn').src = '../res/defuser.webp';
      id('signinout').innerHTML = "Sign in";
      showhide('userpopup');
      alert('please sign in to use the app, you can use the app as a guest but you will not be able to save your data, and you will not be able to restore your data if you sign in later');
    }
  });
}
function submitit() {
  var amt = id('newitemamt').value;
  var date = id('newitemdate').value;
  var cat = id('newitemcat').value;
  var type = id('newitemtype').value;
  if (amt == "" || date == "" || cat == "" || type == "") {
    alert('Please fill in all the fields');
    return;
  }
  if (isNaN(amt)) {
    alert('Please enter a valid amount');
    return;
  }
  if (amt < 0) {
    alert('Please enter a valid amount');
    return;
  }
  if (date > new Date()) {
    alert('Please enter a valid date');
    return;
  }
  addTodo(amt, cat, type, date);
  id('newitemamt').value = "";
  id('newitemdate').value = "";
  id('newitemcat').value = "";
  showhide('addnewpopup');
}
function submiteditit() {
  var amt = document.getElementById('editamt').value;
  var cat = document.getElementById('editcat').value;
  var id = document.getElementById('identifier').innerHTML;
  if (amt == "" || cat == "") {
    alert('Please fill in all the fields');
    return;
  }
  if (isNaN(amt)) {
    alert('Please enter a valid amount');
    return;
  }
  if (amt < 0) {
    alert('Please enter a valid amount');
    return;
  }
  addedittodo(amt, cat, id)
  document.getElementById('editamt').value = "";
  document.getElementById('editcat').value = "";
  showhide('editpopup');
}
function canceltodo() {
  showhide('addnewpopup');
}
function canceledittodo() {
  showhide('editpopup');
}
function addTodo(amt, cat, type, date) {
  var timestamp = new Date().getTime();
  var item = {
    amt: amt,
    cat: cat,
    type: type,
    date: date,
    id: timestamp
  }
  addtopage(item);
  addtofirebase(item);
}
function deletetodo(id) {

  var conf = confirm('Are you sure you want to delete this item?');
  if (conf == true) {
  deletefromfirebase(id);
  var transduration = root.style.getPropertyValue('--transdur');
  document.getElementById(id).style.animation = "deleteme "+transduration+" ease-in-out";
  transduration=Number(transduration.slice(0,-2));
  setTimeout(function () {
    //reduce total amount by the amount of the deleted item
    var totalamt = Number(document.getElementById('totalamt').innerHTML);
    var itemamt = Number(document.getElementById(id).children[1].innerHTML);
    var expenceamt = Number(document.getElementById('expenceamt').innerHTML);
    var incomeamt = Number(document.getElementById('incomeamt').innerHTML);
    if(document.getElementById(id).parentElement.id=='income'){
      incomeamt-=itemamt;
    var newtotalamt = totalamt - itemamt;
    }else{
      expenceamt-=itemamt;
      var newtotalamt = totalamt + itemamt;
    }
    document.getElementById('totalamt').innerHTML = newtotalamt;
    document.getElementById('expenceamt').innerHTML = expenceamt;
    document.getElementById('incomeamt').innerHTML = incomeamt;
    document.getElementById(id).remove();
  },transduration*0.95);
  }
}
function edittodo(id) {
  const db = getDatabase();
  var data = get(ref(db, 'users/' + auth.currentUser.uid + '/todos/' + id));
  data.then((snapshot) => {
    var itemdetails = snapshot.val();
    showhide('editpopup');
    document.getElementById('editamt').value = itemdetails.amt;
    document.getElementById('editcat').value = itemdetails.cat;
    document.getElementById('identifier').innerHTML = itemdetails.id;
  }, (error) => {
    console.log(error);
  });
}
function addedittodo(amt, cat, id) {
  const db = getDatabase();
  var item = get(ref(db, 'users/' + auth.currentUser.uid + '/todos/' + id));
  item.then((snapshot) => {
   var item= snapshot.val();
   item.amt=amt;
   item.cat=cat;
   set(ref(db, 'users/' + auth.currentUser.uid + '/todos/' + id), item);
   document.getElementById(id).innerHTML ='<div>' + item.cat + '</div><div> rs' + item.amt + '</div><div>' + item.date + '</div><div class="itemedit"> <img src="res/edit.webp" title="edit entry" alt="edit"></div><div class="itemdel"> <img src="res/delete.webp" alt="delete" title="delete entry"></div>';
   // attactch event listners
    document.getElementById(id).getElementsByClassName("itemedit")[0].addEventListener('click', function () { edittodo(id); }  );
    document.getElementById(id).getElementsByClassName("itemdel")[0].addEventListener('click', function () { deletetodo(id); }  );
  }, (error) => {
    console.log(error);
  });
}
function addtofirebase(item) {
  const db = getDatabase();
  // add the item to the database
  set(ref(db, 'users/' + auth.currentUser.uid + '/todos/' + item.id), {
    amt: item.amt,
    cat: item.cat,
    type: item.type,
    date: item.date,
    id: item.id
  });
}
function deletefromfirebase(id) {
  const db = getDatabase();
  remove(ref(db, 'users/' + auth.currentUser.uid + '/todos/' + id));
}
function addtopage(item) {
  var itemdiv = '<div class="item" id=' + item.id + '><div>' + item.cat + '</div><div>' + item.amt + '</div><div>' + item.date + '</div><div class="itemedit"> <img src="res/edit.webp" title="edit entry" alt="edit"></div><div class="itemdel"> <img src="res/delete.webp" alt="delete" title="delete entry"></div></div>';
  if (item.type == 'income') {
    id('income').innerHTML += itemdiv;
  }
  else if (item.type == 'expence') {
    id('expence').innerHTML += itemdiv;
  }
  document.getElementById(item.id).getElementsByClassName("itemedit")[0].addEventListener('click', function () { edittodo(item.id); }  );
  document.getElementById(item.id).getElementsByClassName("itemdel")[0].addEventListener('click', function () { deletetodo(item.id); }  );
  updatesummary(item);
  }
function initialsetup(item) {
  var itemdiv = '<div class="item" id=' + item.id + '><div>' + item.cat + '</div><div>' + item.amt + '</div><div>' + item.date + '</div><div class="itemedit"> <img src="res/edit.webp" title="edit entry" alt="edit"></div><div class="itemdel"> <img src="res/delete.webp" alt="delete" title="delete entry"></div></div>';
  if (item.type == 'income') {
    id('income').innerHTML += itemdiv;
  }
  else if (item.type == 'expence') {
    id('expence').innerHTML += itemdiv;
  }
}
function restoredata() {
  const db = getDatabase();
  const data = get(ref(db, 'users/' + auth.currentUser.uid + '/todos/'));
  data.then((snapshot) => {
    if (snapshot.exists()) {
      var data = snapshot.val();
      for (var i in data) {
        initialsetup(data[i]);
        updatesummary(data[i]);
      }
      addqueryselectors();
    } else {
    }
  });
}
function updatesummary(item){
 var amount=parseInt(item.amt);
  
  if (item.type == 'income') {
    income=income+amount;
    id('incomeamt').innerHTML=income;
    totalamt=totalamt+ amount;
    id('totalamt').innerHTML=totalamt;
  }
  else if (item.type == 'expence') {
    expense=expense+amount;
    id('expenceamt').innerHTML=expense;
    totalamt=totalamt-amount;
    id('totalamt').innerHTML=totalamt;
  }
}
function changecol(picker, id) {
  var value = picker.value;
  var box = picker.id;
  id="--"+id;
  root.style.setProperty(id, value);
  savecol(box, id, value);
}
function changevalue(slider, id, measure, mult) {
  var value = slider.value;
  var cvalue = value * mult;
  cvalue = cvalue + measure;
  var box = slider.id;
  id='--'+id;
  root.style.setProperty(id, cvalue);
  saveslidersettings(box, id, value, cvalue);
}
function savecol(box, id, value) {
  var settings = JSON.parse(localStorage.getItem("kubera/colsettings"));
  if (settings == null) {
      settings = [];
  }
  for (var i = 0; i < settings.length; i++) {
      if (settings[i].boxid == box) {
          settings.splice(i, 1);
      }
  }
  settings.push({ boxid: box, prop: id, value: value });
  localStorage.setItem("kubera/colsettings", JSON.stringify(settings));
}
function saveslidersettings(box, id, value, cvalue) {
  var settings = JSON.parse(localStorage.getItem("kubera/slidersettings"));
  if (settings == null) {
      settings = [];
  }
  for (var i = 0; i < settings.length; i++) {
      if (settings[i].boxid == box) {
          settings.splice(i, 1);
          
      }
  }
  settings.push({ boxid: box, prop: id, value: cvalue, val: value });
  localStorage.setItem("kubera/slidersettings", JSON.stringify(settings));
}
function setcol() {
  var settingsdata = JSON.parse(localStorage.getItem("kubera/colsettings"));
  if (settingsdata == null) {
      return;
  }
  for (var i = 0; i < settingsdata.length; i++) {

      var varid = settingsdata[i].prop;
      var value = settingsdata[i].value;
      var colboxid = settingsdata[i].boxid;
      root.style.setProperty(varid, value);
      document.getElementById(colboxid).value = value;

  }
}
function setslidersettings() {
  var settingsdata = JSON.parse(localStorage.getItem("kubera/slidersettings"));
  if (settingsdata == null) {
      return;
  }
  for (var i = 0; i < settingsdata.length; i++) {
      var varid = settingsdata[i].prop;
      var value = settingsdata[i].value;
      var slidervalue = settingsdata[i].val;
      var sliderid = settingsdata[i].boxid;
      root.style.setProperty(varid, value);
      document.getElementById(sliderid).value = slidervalue;
  }
}
function changefont() {
  var query = document.getElementById("fontchanger").value;
  root.style.setProperty("--font", "'" + query + "'");
  savefont(query);
}
function setfont() {
  var font = localStorage.getItem("font");
  if (font == null) {
      font = "Arial";
  }
  root.style.setProperty("--font", font);
  document.getElementById("fontchanger").value = font;
}
function savefont(font) {
  localStorage.setItem("font", font);
}