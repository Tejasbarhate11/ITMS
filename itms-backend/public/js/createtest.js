const titleIn = document.getElementById("titleInput");
const instructionsIn = document.getElementById("instructionsInput");
const departmentIn = document.getElementById("departmentInput");
const designationIn = document.getElementById("designationInput");


const closebtn = document.getElementById("closebtn");
closebtn.addEventListener('click', () => {
    if(titleIn.value.trim() !== ""){
        if(confirm("Do you want to go back?")){
            window.location.href = "/dashboard/tests";
        }
    }else{
        window.location.href = "/dashboard/tests";
    }
})

function createTest(){
    instructionsIn.value = quill.root.innerHTML;
    if(titleIn.value.trim() === ""){
        titleIn.focus();
        alert("Please enter a title for the test")
    }
    else if(instructionsIn.value === ""){
        instructionsIn.focus();
        alert("Please enter suitable instructions for the test.")
    }
    else if(departmentIn.value === "null") {
        alert("Please select a department");
        departmentIn.focus();
    }else if(designationIn.value === "null") {
        alert("Please select a designation");
        designationIn.focus();
    }else{
        fetch('/dashboard/tests/create',{
            method: 'POST',
            body: JSON.stringify({
                title: titleIn.value.trim(),
                instructions: instructionsIn.value,
                DepartmentId: departmentIn.value,
                DesignationId: designationIn.value
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                alert("Test created successfully")
                titleIn.value = "";
                instructionsIn.value = "";
                quill.setContents([{ insert: '\n' }]);
                departmentIn.value = "null";
                designationIn.value = "null";
            }
        });
    }
}