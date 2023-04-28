export function controlValidInput(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(typeof e);
    console.log(e);
    var value = e.currentTarget.value;

    if (value != null) {
        e.currentTarget.value = value.trim();

        console.log(value);

        const check = new RegExp("^[^<>'\\\"/;`% ]*$");

        if (!check.test(value)) {
            //if it is not a number ascii code
            //Prevent default action, which is inserting character
            if (e.preventDefault) e.preventDefault(); //normal browsers
            //e..currentTarget.value = ""; //IE
        }
    }
}
