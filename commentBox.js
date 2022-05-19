
const template = document.createElement("template");


template.innerHTML = `
    <link rel="stylesheet" href="commentBoxStyle.css" />
    <div class="comment-box">
        <div class="comment-edit">
            <input class="comment-input" type="text" />
            <button class="submit-btn">Submit</button>
        </div>
        <div class="comment-display">
            <p class="comment">Comment</p>
            <button class="reply-btn">Reply</button>
            <div class="reply-box"></div>
        </div>
    </div>
`;


const nestingLimit = 3;


export class CommentBox extends HTMLElement {
    constructor() {
        
        super();

        this.level = this.getAttribute("level")
            ? 
              parseInt(this.getAttribute("level"))
            : 
              0;

        // Initializing likeCount to 0 for the comment box.
        this.likeCount = 0;

        
        this.attachShadow({ mode: "open" });

        
        this.shadowRoot.appendChild(template.content.cloneNode(true));

     
        this.commentEdit = this.shadowRoot.querySelector(".comment-edit");
        this.commentDisplay = this.shadowRoot.querySelector(".comment-display");
    }
   
    connectedCallback() {
        
        this.commentEdit
            .querySelector(".submit-btn")
            .addEventListener("click", () => this.commentSubmit());

       
        if (this.level < nestingLimit) {
            this.commentDisplay
                .querySelector(".reply-btn")
                .addEventListener("click", () => this.commentReply());
        } else {
           
            this.commentDisplay.querySelector(".reply-btn").disabled = true;
        }

        this.commentDisplay.style.display = "none";
    }

   
    commentSubmit() {
    
        const commentInput = this.commentEdit.querySelector(".comment-input");

       
        const comment = this.commentDisplay.querySelector(".comment");

       
       comment.innerHTML = commentInput.value;
    
 
        this.commentEdit.style.display = "none";
        
        this.commentDisplay.style.display = "block";
    }

    commentReply() {
        // Make the replyBox variable to point to the reply-box DIV.
        const replyBox = this.commentDisplay.querySelector(".reply-box");
        // create a new comment-box component as an HTML element and set its value to the newCommentBox variable.
        const newCommentBox = document.createElement("comment-box");

        // Set newLevel by incrementing current level by 1.
        let newLevel = this.level + 1;
        // Set the value of level attribute as newLevel for the newCommentBox component.
        newCommentBox.setAttribute("level", newLevel);
        newCommentBox.level = newLevel;

        // If the reply box already has any child nodes,
        if (replyBox.childNodes) {
            // the newCommentBox is inserted before the first child in the reply box.
            replyBox.insertBefore(newCommentBox, replyBox.childNodes[0]);
        } else {
            // newCommentBox is appended directly as the first child.
            replyBox.appendChild(newCommentBox);
        }
    }

    /**
     * The disconnectedCallback() is executed when the component is disconnected from the DOM.
     * Here we remove all the event listeners that were attached while the component was created.
     */
    disconnectedCallback() {
        this.commentEdit.querySelector(".comment-submit").removeEventListener();
        this.commentDisplay.querySelector(".reply-btn").removeEventListener();
       
    }
}
