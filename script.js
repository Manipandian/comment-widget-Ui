const comments = document.getElementById("comments");
let commentId = "";
let commentContent = "";
let addCommentElement;
let currentCommentId = "";

// Sample comment data
let data = [
  {
    id: "0",
    mainComment: "Mani, Nature always looks beautiful. Its a eyr refreshing thing. Thanks for the colorful one",
    subComment: [
      {
        id: "0-0",
        mainComment: "Affronting everything discretion men now own did",
        subComment: [
          {
            id: "0-0-0",
            mainComment: "Still round match we to. Frankness pronounce daughters remainder extensive has but. Happiness cordially one determine concluded fat",
            subComment: [],
          },
          {
            id: "0-0-1",
            mainComment: "Plenty season beyond by hardly giving of. Consulted or acuteness dejection an smallness if. Outward general passage another as it. Very his are come man walk one next",
            subComment: [],
          },
        ],
      },
    ],
  },
  {
    id: "1",
    mainComment: "Divya, Nature is always looks beautiful. Its a eyr refreshing thing. Thanks for the colorful one",
    subComment: [
      {
        id: "1-0",
        mainComment: "Two exquisite objection delighted deficient yet its contained",
        subComment: [
          {
            id: "1-0-0",
            mainComment: "Cordial because are account evident its subject but eat.",
            subComment: [],
          },
        ],
      },
    ],
  },
];

// Comment template contain comment text and buttons
const commentTemplate = (id, content) => {
  let container = document.createElement("div");
  let userData = document.createElement("div");
  let mainComment = document.createElement("div");
  let subElement = document.createElement("div");
  let button = document.createElement("button");
  let deleteButton = document.createElement("button");
  userData.innerHTML = "User name<br><i class='description'>Describe about the user coat</i>";
  userData.setAttribute("class", "user-data");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", deleteComment)
  button.innerText = "Comment";
  button.addEventListener("click", addComment);
  subElement.style.paddingLeft = "10px";
  subElement.setAttribute("id", "sub-container");
  mainComment.innerHTML = content;
  container.setAttribute("id", id);
  container.setAttribute("class", "comment-container");
  container.appendChild(userData);
  container.appendChild(mainComment);
  container.appendChild(button);
  container.appendChild(deleteButton);  
  container.appendChild(subElement);
  return container;
};

//To get comment text from text box
const getCommentText = (event) => {
  commentContent = event.target.value;
};

//To store new comment to main data
function updateData(id, type) {
  if (id === "main") {
    commentId = data.length.toString();
    let mainUserComment = {
      id: commentId,
      mainComment: commentContent,
      subComment: [],
    };
    data.push(mainUserComment);
  } else {
    data.forEach(function iter(node, index, array) {
      let length = node.id.length;
      if (node.id === id) {
        if (type === "add") {
          nextIndex = node.subComment.length;
          commentId = currentCommentId + `-${nextIndex}`;
          let actualComment = {
            id: commentId,
            mainComment: commentContent,
            subComment: [],
          };
          node.subComment.push(actualComment);
        } else if (type === "delete"){
          console.log(index);
          array.splice(index, 1);
        }
        
      } else if (node.id === id.slice(0, length)) {
        node.subComment.forEach(iter);
      }
    });
  }
  console.log("After", data);
  localStorage.setItem("comment-data", JSON.stringify(data));
}

//To upload the newly added text as a comment in UI
const uploadComment = (event) => {
  if (commentContent !== "") {
    commentId = "";
    updateData(currentCommentId, "add");
    let currentParent = event.currentTarget.parentElement.parentElement;
    let commentTemplateElement = commentTemplate(commentId, commentContent);
    let commentBox = currentParent.querySelector("#commentBox");
    commentBox.querySelector("#comment-textbox").value = "";
    commentBox.remove();
    if (currentParent.id === "comments") {
      currentParent.insertBefore(
        commentTemplateElement,
        currentParent.childNodes[0]
      );
    } else {
      let currentSubElement = currentParent.querySelector("#sub-container");
      currentSubElement.insertBefore(
        commentTemplateElement,
        currentSubElement.childNodes[0]
      );
    }
  }
};

// To create a text box and button to upload comment
const createCommentTextBoxContainer = () => {
  let container = document.createElement("div");
  container.setAttribute("id", "commentBox");
  let textBox = document.createElement("input");
  textBox.setAttribute("id", "comment-textbox");
  let button = document.createElement("button");
  button.innerText = "Reply";
  textBox.addEventListener("input", getCommentText);
  button.addEventListener("click", uploadComment);
  container.appendChild(textBox);
  container.appendChild(button);
  return container;
};

addCommentElement = createCommentTextBoxContainer();

//To add new existing comment
const   addComment = (event) => {
  const currentElement = event.currentTarget;
  const parentElement = currentElement.parentElement;
  currentCommentId = parentElement.id;
  let oldElement = document.getElementById("commentBox");
  if (oldElement) {
    oldElement.querySelector("#comment-textbox").value = "";
    oldElement.remove();
  }
  mainComment = "";
  parentElement.appendChild(addCommentElement);
};

//To delete existing comment
const deleteComment = (event) => {
  const currentElement = event.currentTarget;
  const parentElement = currentElement.parentElement;
  currentCommentId = parentElement.id;
  console.log("delete", currentCommentId);
  updateData(currentCommentId, "delete");
  parentElement.remove();
}

// To render old comments data while initial load
const initialCommentRender = (data, parentElement) => {
  data.forEach((element) => {
    let commentTemplateElement = commentTemplate(
      element.id,
      element.mainComment
    );
    parentElement.appendChild(commentTemplateElement);
    if (element.subComment.length) {
      initialCommentRender(
        element.subComment.slice().reverse(),
        commentTemplateElement.querySelector("#sub-container")
      );
    }
  });
};

//To get data from local storage
let localData = localStorage.getItem("comment-data");
data = localData ? [...JSON.parse(localData)] : [...data];
console.log(localData);
initialCommentRender(data.slice().reverse(), comments);

const addMainComment = () => {
  currentCommentId = 'main';
  comments.insertBefore(addCommentElement, comments.childNodes[0]);
};
