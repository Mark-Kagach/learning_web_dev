document.addEventListener('DOMContentLoaded', () => {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(email) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  if (email) {
    // Fill in fields basen on email
    document.querySelector('#compose-recipients').value = `${email.sender}`;
    const start = email.subject.slice(0,3);
    if (start =='Re:'){
      document.querySelector('#compose-subject').value = `${email.subject}`;
    }
    else {
      document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    }
    document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
  }
  else {
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // make get request to /emails/<mailbox>
  fetch(`/emails/${mailbox}`) 
  .then(response => response.json()) 
  .then(emails => {
    // Print emails console.log(emails);

    //create its own div to separate with view name
    const email_container = document.createElement('div');
    email_container.id = 'email_container';
    document.querySelector('#emails-view').append(email_container);

    // use the forEach function to go over the array of emails! use id="emails-view"
    emails.forEach(element => {

      const email = document.createElement('div');
      email.innerHTML=`
          <span class="sender">${element.sender}</span>
          <span>${element.subject}</span>
          <span>${element.timestamp}</span>
      `;
      email.id='email';
      email.addEventListener('click', function() {

        fetch(`/emails/${element.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        });

        load_email(element.id);
      })

      document.querySelector('#email_container').append(email);

      //if read = color gray
      if (mailbox=='inbox' && element.read) {
        email.style.backgroundColor = '#f0f0f0';
      }
    });
  });
}

function send_email(event) {
  event.preventDefault();

  //take recipients,subject,body
  const _recipients = document.querySelector('#compose-recipients').value;
  const _subject = document.querySelector('#compose-subject').value;
  const _body = document.querySelector('#compose-body').value;

  // make a POST request (api) to /emails passing recipient,subject, body
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: _recipients,
      subject: _subject,
      body: _body
      })  
    }) 
    .then(response => response.json()) 
    .then(result => {
      // Print result 
      console.log(result);

      //load the user's mailbox
      load_mailbox('sent')
    });
}

function load_email(email_id) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  //make a get request to the email id.
  fetch(`/emails/${email_id}`) 
  .then(response => response.json()) 
  .then(email => {
    // Print email 
    console.log(email);

    //SHOW EMAIL INFO
    user = document.querySelector('h2').innerHTML //get the user
    if (email.sender!=user && email.archived==false) {
      document.querySelector('#emails-view').innerHTML=`
        <p>By ${email.sender} to ${email.recipients} at ${email.timestamp}</p>
        <p>Subject: ${email.subject}</p>
        <p>${email.body}</p>
        <button id="archive">Archive</button>
        <button id="reply">Reply</button>
      `;

      document.querySelector('#archive').addEventListener('click', () => archive(email));
      document.querySelector('#reply').addEventListener('click', () => compose_email(email)); 
    }
    else if (email.archived==true) {
      document.querySelector('#emails-view').innerHTML=`
        <p>By ${email.sender} to ${email.recipients} at ${email.timestamp}</p>
        <p>Subject: ${email.subject}</p>
        <p>${email.body}</p>
        <button id="archive">Unarchive</button>
        <button id="reply">Reply</button>
      `;

      document.querySelector('#archive').addEventListener('click', () => archive(email));
      document.querySelector('#reply').addEventListener('click', () => compose_email(email)); 
    }
    else {
      document.querySelector('#emails-view').innerHTML=`
        <p>By ${email.sender} to ${email.recipients} at ${email.timestamp}</p>
        <p>Subject: ${email.subject}</p>
        <p>${email.body}</p>
      `;
    }
  });
}

function archive(email){

  if (email.archived==true) {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
    .then(response => {
      load_mailbox('inbox');
    })
  }
  else {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
    .then(response => {
      load_mailbox('archive');
    })
  }
}