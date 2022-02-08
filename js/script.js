let inpField = document.querySelector(".inpField");
let Series = [],
    flag = false,
    lastAns = 0;

function clicked(num) {
    if (flag || inpField.value == 'MusTaFa KhaShaBa') {
        inpField.value = " ";
        flag = false;
    }
    inpField.style.textAlign = 'left';
    inpField.value += num;
    Series = [];
}

function click_ShutDown() {
    inpField.value ='';
    inpField.style.textAlign = 'center';

}

function click_Clr() {
    inpField.value = " ";
}

function Dele() {
    if (!flag && inpField.value.length != 0) {
        //delete only if field has data or that doesn't Calcutated value
        let Se = inpField.value.split("");
        Se.length = Se.length - 1;
        inpField.value = Se.join("");
    }
}

function Calc() {
    if (!flag) {
        let temp = [],
            postFix = [];
        Series = inpField.value.split("");

        flag = true;
        for (let i = 0; i < Series.length; i++) {
            // Series[i]
            if (Series[i] == "A") {
                i += 2;
                postFix.push(lastAns);
            }
            if (!isNaN(parseInt(Series[i]))) {
                // IF Num, Push It To PostFix
                let x = [];
                while (!isNaN(parseInt(Series[i])) || Series[i] == ".") {
                    x.push(Series[i++]);
                }
                postFix.push(x.join(""));
                i--;
            } else if (Series[i] == "(") {
                // If Left Par( Then Push It To Temp
                temp.push(Series[i]);
            } else if (Series[i] == ")") {
                // if right par) , pop all operators from temp and push them to postFix Untill left par ( found.
                while (temp[temp.length - 1] != "(") {
                    postFix.push(temp.pop());
                }
                // Loop Will stop when left par ( found , we should delete it now.
                temp.pop();
            } else {
                // If It operator

                if (temp[temp.length - 1] == "(" || temp.length == 0) {
                    // If Temp Has No items Or last elment is left par ( ,Push Current operator To Temp

                    temp.push(Series[i]);
                } else if (Series[i] == "^") {
                    // If Current operator is ^ ( highest priority)

                    if (temp[temp.length - 1] == "^") {
                        // If last operator in temp is ^ ( Same priority), Push Current operator to PostFix direct

                        postFix.push("^");
                    } else {
                        // If last operator in temp is other operator (less priority), Push current operator to temp direct

                        temp.push("^");
                    }
                } else if (Series[i] == "*" || Series[i] == "/") {
                    // If Current operator is * | /

                    let x = 2;
                    while (x--) {
                        if (temp[temp.length - 1] == "^") {
                            //if last operator in temp is ^ (has high priority) , pop it from temp and push it to postFix
                            postFix.push(temp.pop());
                        } else if (
                            temp[temp.length - 1] == "*" ||
                            temp[temp.length - 1] == "/"
                        ) {
                            //if last operator in temp is * || / , pop it from temp and push it to postFix
                            postFix.push(temp.pop());
                            // Then push The Current operator to temp
                            temp.push(Series[i]);
                            break;
                        } else {
                            //If it - || + (less priority) push current operator to temp direct
                            temp.push(Series[i]);
                            break;
                        }
                    }
                } else {
                    // Current operator is - || +
                    let x = 3;

                    while (x--) {
                        if (
                            temp[temp.length - 1] == "^" ||
                            temp[temp.length - 1] == "*" ||
                            temp[temp.length - 1] == "/"
                        ) {
                            //if last operator in temp is ^ (has high priority) , pop it from temp and push it to postFix
                            postFix.push(temp.pop());
                        } else {
                            //If it - || + (less priority) push current operator to temp direct
                            temp.push(Series[i]);
                            break;
                        }
                    }
                }
            }
        }
        // if temp has operator must push them to postFix
        while (!(temp.length == 0)) {
            postFix.push(temp.pop());
        }
        temp = Calc_PostFix(postFix);
        inpField.value = isNaN(temp) ? "Syntax Error" : temp;
        lastAns = +inpField.value;
    }
}

function Calc_PostFix(Exp) {
    let stack = [],
        oper = 0,
        fNum = 0,
        sNum = 0;

    for (let i = 0; i < Exp.length; i++) {
        if (!isNaN(parseInt(Exp[i]))) {
            stack.push(Exp[i]);
        } else {
            fNum = stack.pop();
            sNum = stack.pop();

            switch (Exp[i]) {
                case "+":
                    oper = +sNum + +fNum;
                    break;
                case "-":
                    oper = +sNum - +fNum;
                    break;
                case "*":
                    oper = +sNum * +fNum;
                    break;
                case "/":
                    oper = +sNum / +fNum;
                    break;
                case "^":
                    oper = (+sNum ) ** (+fNum);
                    break;
                default:
                    break;
            }
            stack.push(oper);
        }
    }
    return oper;
}