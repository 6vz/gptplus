document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.executeScript(
    {
      code: "window.getSelection().toString();",
    },
    function (selection) {
      if (selection[0] === undefined) {
        selection[0] = "";
      }
      document.querySelector("#input").value = selection[0];
    }
  );

  document.querySelector("#submit").addEventListener("click", function () {
    var input = document.querySelector("#input").value;
    var output = document.querySelector("#result");

    var views = chrome.extension.getViews({ type: "popup" });

    for (var i = 0; i < views.length; i++) {
      var view = views[i];
      var outputElement = view.document.querySelector("#result");
      if (localStorage.getItem("key") === null) {
        alert(
          "Key is not set! Please click the key icon, at the bottom right corner, and enter the corner\n\nNote: Please read the instructions, included in the key prompt, before entering and submitting your key :)"
        );
        return;
      } else {
        const key = localStorage.getItem("key");
        const openaiApiKey = key;
        console.log("Asking OpenAI for completion... (this may take a while)");
        console.log(`Key is: ${openaiApiKey}, Query is ${input}`);
        document.querySelector("#loading").style.display = "block";
        document.querySelector("#menu").style.display = "none";
        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: `From now on, you're smart and inteligent browser extension, your only task is to provide simple and short content without bullshit. If user asks you to do something, you're doing it, and going straight to the point, without useless talking. Answer in user's language. ALWAYS RESPONSE WITH SHORTEST VERSION POSSIBLE, NEVER TALK USELESS. But there is a catch, user has to be satisfied with answer, so do not answer with 1 sentence. Always use atleast 2 sentences, BUT NEVER MORE THAN 5. Never list anything from point to point. Here's what user asks for: ${input}`,
              },
            ],
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            let answer = data.choices[0].message.content;
            answer = answer.replace(/\\n/g, " ");
            answer = answer.replace(/\\t/g, " ");
            answer = answer.replace(/\\r/g, " ");
            answer = answer.replace(/\\f/g, " ");
            answer = answer.replace(/  /g, " ");
            answer = answer.replace(/  /g, " ");
            console.log(`Answer is: ${answer}`);
            document.querySelector("#loading").style.display = "none";
            answer = "<br>" + answer;
            outputElement.innerHTML = answer;
          })
          .catch((error) => {
            alert(
              "Error occured! Please check your internet connection, and try again. If error persists, please contact me on Discord: @6vz#4123"
            );
          });
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#loading").style.display = "none";
  document.querySelector("#key").addEventListener("click", function () {
    var key = prompt(
      "ENTER YOUR OPENAI API KEY!\n\nYou can obtain one from platform.openai.com. This key will be saved to your local storage, for better experience. If you want to change it, just click the key, and leave empty prompt.\n\nWE DON'T HAVE ACCESS TO THAT KEY! THIS KEY IS CONSIDERED A SECRET! TREAT IT LIKE YOUR PASSWORD!\n\nREMEMBER: IF YOU ALREADY USED TRIAL, IT WILL CHARGE YOU FOR USAGE! AUTHOR OF THIS EXTENSION IS NOT RESPONSIBLE FOR ANY CHARGES!\n\nYOU'RE ONE RESPONSIBLE FOR CHARGES FOR USING THIS EXTENSION! THIS EXTENSION IS LIKE A CLIENT FOR OPENAI, WHICH IS PAID, AUTHOR DOES NOT TAKE ANY RESPONSIBILITIES FOR YOUR STUPID ACTIONS.\n\nBefore starting please get yourself known with OpenAI pricing."
    );
    if (key === "") {
      alert(
        "Key has been cleared! If you didn't want to clear it, just click the key again, and enter your key."
      );
      localStorage.removeItem("key");
    } else {
      alert(
        "Key has been saved! If you want to change it, just click the key again, and enter your key."
      );
      localStorage.setItem("key", key);
    }
  });
});
