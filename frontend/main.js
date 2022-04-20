
const main = document.querySelector(".main");




 

const getAudio = async (bookData) => {
  let {data} = await axios.get("http://localhost:1337/api/audiobooks?populate=*");
     renderData(bookData, data);
}

const getBooks = async() => {
    let {data} = await axios.get("http://localhost:1337/api/books?populate=*");
    console.log(data)
    
    getAudio(data)
}

getBooks()

let booksContainer = document.querySelector(".books-container")
let audiosContainer = document.querySelector(".audios-container")
let usersBooks = document.querySelector(".usersBooks")
let usersAudio = document.querySelector(".usersAudio")

const renderData = async(books, audio) => {
  booksContainer.innerHTML = "";
  audiosContainer.innerHTML = "";
  usersBooks.innerHTML = "";
  usersAudio.innerHTML = "";
  let userID = sessionStorage.getItem("userID")

  
  books.data.forEach(book => {
    book=book.attributes;
    
   
    // let altText = book.Cover.data.attributes.alternativeText
    let cover = book.Cover.data.attributes;
    let genre = book.category.data.attributes.Genre;
    let image = "http://localhost:1337" + cover.url;

    let bookCard = document.createElement("article");
    bookCard.classList.add("card")

    bookCard.innerHTML += `<img src="${image}" > <br>
    <strong> ${book.Title}</strong>
    <p>Author: ${book.Author}</p>
    <p>Genre: ${genre} </p>
    <p>Pages: ${book.Pages} </p>
    <h4>Contact</h4>
    <p> ${book.username} </p>
    <p> ${book.userEmail} </p>
    `;
    
    let i=0
    let span = document.createElement("span");
    while (i < book.Stars) {
      
      span.innerHTML+=`<i class="fas fa-star"></i>`
      i++
    }
    
    bookCard.appendChild(span)
    booksContainer.appendChild(bookCard)

      if(book.uploadingUser === userID){
        usersBooks.appendChild(bookCard.cloneNode(true))
    }
  })

  audio.data.forEach(audio => {
    audio = audio.attributes;
    let audioCard = document.createElement("div");
    audioCard.classList.add("card")
    let audioCover = audio.Cover.data.attributes;
    let audioGenre = audio.category.data.attributes.Genre;
    let audioImage = "http://localhost:1337" + audioCover.url;

    audioCard.innerHTML += `<img src="${audioImage}"> <br>
    <strong> ${audio.Title}</strong>
    <p>Length: ${audio.Length} min</p>
    <p>Genre: ${audioGenre} </p>
    <p>Releas: ${audio.Release} </p>
    <h4>Contact</h4>
    <p> ${audio.username} </p>
    <p>${audio.userEmail} </p>
    ` 
    
    let i=0
    let audioSpan = document.createElement("span");
    while (i < audio.Stars) {
      
      audioSpan.innerHTML+=`<i class="fas fa-star"></i>`
      i++
    }

    audioCard.appendChild(audioSpan)
    audiosContainer.appendChild(audioCard)

    
    if(audio.uploadingUser == userID){
      usersAudio.appendChild(audioCard.cloneNode(true))
    }
    
  });

};
const signOut = () => {
  sessionStorage.clear()
  window.location.reload(); 
  btnContainer.classList.add("hidden")

}
document.querySelector(".signOut").addEventListener("click", signOut)

//???
const loginContainer = document.querySelector(".login-container")

if(sessionStorage.getItem("token")){
  loginContainer.classList.add("hidden")
}


let login = async () => {
  let username= document.querySelector("#username").value;
  let password= document.querySelector("#password").value;
  let response
  try {
    response = await axios.post("http://localhost:1337/api/auth/local", {
    identifier: username,
    password,  
  });
  }catch (err) {
    alert("Wrong username or password")
  }
 
  let token = response.data.jwt;
  let email = response.data.user.email
  let userID = response.data.user.id
     loggedIn(token, username, email, userID)
  
  };
  let btnContainer = document.querySelector(".buttons")



  const loggedIn = (token, username, email, userID) => {
    loginContainer.classList.add("hidden")
    registrationContainer.classList.add("hidden")
    publicBtns.classList.add("hidden")
    btnContainer.classList.remove("hidden")
    sessionStorage.setItem("email", email)
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userID", userID);
    sessionStorage.setItem("username" , username )
    let loggedIn = document.createElement("h2");
    loggedIn.classList.add("welcome")
    loggedIn.innerText = "Signed in as " + username;
    main.prepend(loggedIn);
    };

  


  const showLogin = () => {
    loginContainer.classList.remove("hidden");
    registrationContainer.classList.add("hidden");
  } 


  

const showRegistration =  () => {
  registrationContainer.classList.remove("hidden");
  loginContainer.classList.add("hidden")
};
let registrationContainer= document.querySelector(".registration-container");
const toLoginBtn = document.querySelector(".toLogin").addEventListener("click", showLogin);
  const toRegisterBtn = document.querySelector(".toNewUser").addEventListener("click", showRegistration);
const registerUser = async() => {
  let username = document.querySelector("#newUsername").value;
  let email = document.querySelector("#newEmail").value;
  let password = document.querySelector("#newPassword").value
  let response
  try {
     response = await axios.post("http://localhost:1337/api/auth/local/register", {
    
      username,
      password,
      email,
    
  })
  } catch (err) {
    alert("The email you are trying to use is already registered");
    
  }
  let token = response.data.jwt;
  let userID = response.data.user.id
  
  
  loggedIn(token, username,email, userID)
  
};

  const publicBtns = document.querySelector(".publicBtns");
  const loginBtn = document.querySelector(".login").addEventListener("click", login)
    const registerUserBtn = document.querySelector(".register").addEventListener("click", registerUser);
  const uploadContainer = document.querySelector(".uploadContainer")
  const contentUploadBtn = document.querySelector(".content")
  const profileBtn = document.querySelector(".profileBtn")
  const profile = document.querySelector(".profile");
  const profileInfo = document.querySelector(".profileInfo")
  const usersContent = document.querySelector(".usersContent");
  const public = document.querySelector(".public");
  const homeBtn =  document.querySelector(".homeBtn");


  let token = sessionStorage.getItem("token");
  if(token){
    btnContainer.classList.remove("hidden")
    publicBtns.classList.add("hidden")
  }

  async function profilePage() {
    profile.classList.remove("hidden");
    public.classList.add("hidden")
    homeBtn.classList.remove("hidden")
    profileBtn.classList.add("hidden")
    contentUploadBtn.classList.remove("hidden")
    uploadContainer.classList.add("hidden")
  
    profileInfo.innerHTML = "";
    usersBooks.innerHTML = "";
    usersAudio.innerHTML = "";
    
    
    let {data} = await axios.get("http://localhost:1337/api/users/me", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
    });
    let ul = document.createElement("ul")

    let created = data.createdAt;
    created = created.slice(0, 10);
    ul.innerHTML = `<li>Username: ${data.username} </li> <li>Email: ${data.email} </li> <li>ID: ${data.id} </li> <li>Registered: ${created} </li>&nbsp`
                 
    profileInfo.appendChild(ul)
          getBooks()
  }



const showAllProducts = () => {
  getBooks()
  homeBtn.classList.add("hidden") 
  public.classList.remove("hidden");
  profile.classList.add("hidden")
  uploadContainer.classList.add("hidden")
  contentUploadBtn.classList.remove("hidden")
  profileBtn.classList.remove("hidden")
}   


const uploadPage = () =>{
  public.classList.add("hidden")
  homeBtn.classList.remove("hidden") 
  contentUploadBtn.classList.add("hidden")
  profileBtn.classList.remove("hidden")
  profile.classList.add("hidden")
  uploadContainer.classList.remove("hidden")

}
  const uploadType = document.querySelector("#uploadType");  

  uploadType.addEventListener("change", () => {
    const uploadBookContainer = document.querySelector(".uploadBookContainer")
    const uploadAudioContainer = document.querySelector(".uploadAudioContainer");
  switch(uploadType.value) {
    case "uploadBook":
      uploadBookContainer.classList.remove("hidden")
      uploadAudioContainer.classList.add("hidden")
      break;
    case "uploadAudio":
      uploadAudioContainer.classList.remove("hidden")
      uploadBookContainer.classList.add("hidden")
      break; 
      default:
        uploadBookContainer.classList.add("hidden")
        uploadAudioContainer.classList.add("hidden") 
  }
  });


const audioUpload = async () => {
  let userID = sessionStorage.getItem("userID")
  let username = sessionStorage.getItem("username")
  let userEmail = sessionStorage.getItem("email")
  let Release = document.querySelector("#release").value
  let Author = document.querySelector("#audioAuthor").value
  let category = document.querySelector("#audioGenre").value
  let Title = document.querySelector("#audioTitle").value
  let Length = document.querySelector("#length").value
  let Stars = document.querySelector("#audioGrade").value
  let audioCover = document.querySelector("#audioCover").files;
  let audioCoverData = new FormData();
  audioCoverData.append("files", audioCover[0]);
   


  axios.post("http://localhost:1337/api/upload", audioCoverData, {
    headers: {
       Authorization:`Bearer ${sessionStorage.getItem("token")}`,
    },
  })
  
  .then((response) => { console.log(response)
    let audioCoverId = response.data[0].id;
    axios.post("http://localhost:1337/api/audiobooks?populate=*", {
      data:{
        Title,
        Author,
        Release,
        Length, 
        Stars,
        uploadingUser: userID,
        username,
        userEmail,
        Cover: audioCoverId,
        category,
        user: userID,
        
      }
    },
      {
        headers: {
          Authorization:`Bearer ${sessionStorage.getItem("token")}`
        }
    });
  })
  
  
  getBooks()
}





async function bookUpload() {
  let userID = sessionStorage.getItem("userID")
  let username = sessionStorage.getItem("username")
  let userEmail = sessionStorage.getItem("email")

  let category = document.querySelector("#bookGenre").value
  let Title = document.querySelector("#bookTitle").value
  let Author = document.querySelector("#author").value
  let Pages = document.querySelector("#pages").value
  let Stars = document.querySelector("#bookGrade").value
  let Cover = document.querySelector("#bookCover").files;
  let CoverData = new FormData();
  CoverData.append("files", Cover[0]);



  axios.post("http://localhost:1337/api/upload", CoverData, {
    headers: {
       Authorization:`Bearer ${sessionStorage.getItem("token")}`,
    },
  })
  .then((response) => {
    let CoverId = response.data[0].id;
    axios.post("http://localhost:1337/api/books?populate=*", {
      data:{
        Title,
        Author,
        Pages, 
        Stars,
        Cover: CoverId,
        category,
        uploadingUser: userID,
        username, 
        userEmail,
        user: userID,
      }
    },
      {
        headers: {
          Authorization:`Bearer ${sessionStorage.getItem("token")}`
        }
    });
  })
  
  
  getBooks()
}


