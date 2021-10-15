console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  
  
  

  self.registration.showNotification(data.title,{body:data.body,icon:data.icon});
  //self.registration.showNotification(data.title,{body:data.body,icon:data.icon,data:{redirectUrl:"https://maps.google.com"}});

  //self.registration.showNotification(data.title,data.body,{icon:"https://dzirebackend.herokuapp.com//assets/img/logo.png"});

  
  // self.registration.showNotification(data.title, 
  // {
  //   body: "You have new request for approv product.",
  //   icon: "https://dzirebackend.herokuapp.com//assets/img/logo.png"
  // });


  // self.registration.showNotification(data.title,{
  //   body: "Notified by Traversy Media!",
  //   icon: "http://image.ibb.co/frYOFd/tmlogo.png"
  // });



});
