var typed = new Typed(".head", {
    strings: ["SAFE ! SECURE ! STRONG"],
    typeSpeed: 100,
    backSpeed:100,
    backDelay: 1000,
    loop: true
})

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            document.getElementById("alert").style.display = "inline";
            setTimeout(() => {
                document.getElementById("alert").style.display = "none";
            }, 2000);
        },
        () => {
            alert("Clipboard copying failed");
        }
    );
}

const deletePassword = (website) => {
    alert(`Successfully deleted ${website}'s password`);
    
};