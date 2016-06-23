$(document).ready(function(){

});

var navLoggedIn = 
"<ul class='nav navbar-nav navbar-right navLoggedIn'>" +
"<li><button type='button' class='btn' id='burger'> Sidebar </button></li>" +
"<li><button type='button' class='btn btn-secondary' id='btn-create' data-toggle='modal' data-target='#submitGig'> Add new </button></li>" +
"<li><button type='button' class='btn btn-secondary' id='btn-logout' data-toggle='modal' data-target='#logOut'> Log Out </button></li>" +
"</ul>";

var navLoggedOut = 

"<ul class='nav navbar-nav navbar-right col-sm-8 navLoggedOut'>" +
"<li><button type='button' class='btn' id='burger'> Sidebar </button></li>" +
"<li><button type='button' class='btn' id='btn-signup' data-toggle='modal' data-target='#signUp'> Sign up </button></li>" +
"<li><button type='button' class='btn' id='btn-login' data-toggle='modal' data-target='#logIn'> Log in </button></li>" +
"</ul>"; 

// CREATE SESSION WITH TOKEN (LOGIN)
function createSession(){
  event.preventDefault();

  $.post("http://localhost:3000/login", {
    email: $('#login-email').val(),
    password: $('#login-password').val()
  }).done(function(data) {
   window.localStorage.setItem('token', data.token);
   location.reload();

   $.ajaxSetup({
     headers: { 'Authorisation': 'Bearer ' + data.token }
   });  

 });

};

// CHECK FOR TOKEN
var token = window.localStorage.getItem('token');
if(token) {

  $.ajaxSetup({
    headers: {'Authorisation': 'Bearer ' + token }
  });
  $('#navbar').prepend(navLoggedIn);
  $('.navLoggedOut').hide();


  var ajax = $.get('http://localhost:3000/currentUser')
  .done(function(user){
    $('.navLoggedIn').prepend("<li><button type='button' class='btn show-user btn-create' id='btn-create' data-toggle='modal' data-target='#showUser'> Hello, " + user.currentUser.firstName + "</button></li>") 
  });

}else {
  $('#navbar').prepend(navLoggedOut);
  $('.navLoggedIn').hide();

}

// LOGOUT
$('#btn-logout').click(function(){
  window.localStorage.removeItem('token');

  $('#navbar').prepend(navLoggedOut);
  $('.navLoggedIn').hide();
  location.reload();

});

// SHOW USER
function showUser(){
//using hard coded user id in url link
var ajax = $.get('http://localhost:3000/currentUser')
.done(function(user){

  $('#showuser-modal').empty();
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/users/' + user.currentUser._id
      // + $(this).data()._id
      // + $(this).data().id
    }).done(function(data){
      console.log("ajax is listening");

      var editUser = "<li><a href='#' class='edit-user' data-dismiss='modal' data-toggle='modal' data-target='#edit-user' data-id='"+user.currentUser._id+"'>Edit</a></div></li>";

      var userShow =
      "<li> <div class='imageWrapper'><img class='showImage' src='../api/" + user.currentUser.profile_photo + "'></div></li>" +
      "<div class='showInfo userInfo'><li>First Name: " + user.currentUser.firstName + "</li>"+
      "<li>Last Name: " + user.currentUser.lastName + "</li>" +
      "<li>City: " + user.currentUser.city + "</li>" +
      "<li>Country: " + user.currentUser.country + "</li></div>";

      $('#showuser-modal').prepend(userShow);

      function toggleEdit(){
        var currentUser = user.currentUser._id;
        if(currentUser){
          $('.userInfo').append(editUser);
        }
      }

      // $('.userImage').css("border-radius", "25%");

      toggleEdit();
    });

  });

}

function createUser(){
  event.preventDefault();
  console.log("creating user");

  console.log("YYYYYYYY" + $("input#reg-passwordconfirmation").val());

  var formData = new FormData();
  formData.append("email", $("input#reg-email").val())
  formData.append("password", $("input#reg-password").val())
  formData.append("passwordConfirmation", $("input#reg-passwordconfirmation").val())
  formData.append("firstName", $("input#reg-firstname").val())
  formData.append("lastName", $("input#reg-lastname").val())
  formData.append("city", $("input#reg-city").val())
  formData.append("country", $("select#reg-country").val())
  // APPENDING PROFILE PHOTO
  formData.append("profile_photo", $('#reg-profilephoto')[0].files[0]);

  $.ajax({
    url:'http://localhost:3000/register',
    type:'post',
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
  }).done(function(data) {
    console.log(data);
    $("input#reg-email").val(null),
    $("input#reg-password").val(null),
    $("input#reg-firstname").val(null),
    $("input#reg-lastname").val(null),
    $("input#reg-city").val(null),
    $("select#reg-country").val(null)


    window.localStorage.setItem('token', data.token);
    $.ajaxSetup({
      headers: { 'Authorisation': 'Bearer ' + data.token }
    }); 
    location.reload();
  });

}

// EDIT USER
function editUser(){

  var ajax = $.get('http://localhost:3000/currentUser')
  .done(function(user){

    $('#submitUserUpdate').attr('data-id', user.currentUser._id); 

    console.log('editing a user');

   $.ajax({
    method: 'get',
    url: 'http://localhost:3000/users/'+ user.currentUser._id
  }).done(function(person){
    console.log(person);
    $("input#edit-firstname").val(person.currentUser.firstName),
    $("input#edit-lastname").val(person.currentUser.lastName),
    $("input#edit-city").val(person.currentUser.city),
    $("select#edit-country").val(person.currentUser.country)
  });

      // $("input#edit-firstname").val(person.firstname),
      // $("input#edit-lastname").val(person.lastname),
      // $("input#edit-city").val(person.city),
      // $("select#edit-country").val(person.country);

    // $('#edit-user-form').on('submit', updateUser);
  })
}

var updateUser = function(){
  event.preventDefault();
  console.log("listening to update");
  
  var ajax = $.get('http://localhost:3000/currentUser')
  .done(function(user){


    var person = { user: { 
     "firstName": $("input#edit-firstname").val(),
     "lastName": $("input#edit-lastname").val(),
     "city": $("input#edit-city").val(), 
     "country": $("select#edit-country").val()
   }};

   $.ajax({
    method: 'patch',
    url: 'http://localhost:3000/users/'+ user.currentUser._id,
    data: person
  }).done(function(data){
              // not ideal
              location.reload();
            }); 
});
}


  // console.log('editing a user');
//   var user = testUser;
//     $("input#edit-firstname").val(user.firstname),
//     $("input#edit-lastname").val(user.lastname),
//     $("input#edit-city").val(user.city),
//     $("select#edit-country").val(user.country)

//   $('#edit-user-form').on('submit', updateUser);



// var updateUser = function(){
//   event.preventDefault();
//   var user= {
//  "fistname": $("input#edit-firstname").val(),
//  "lastname": $("input#edit-lastname").val(),
//  "city": $("input#edit-city").val(), 
//  "country": $("select#edit-country").val()
//   };
//   $.ajax({
//     method: 'patch',
//     url: 'http://localhost:3000/users/'+$(this).data().id,
//     data: user
//   }).done(function(data){
//     // not ideal
//     location.reload();
//   });
// }





