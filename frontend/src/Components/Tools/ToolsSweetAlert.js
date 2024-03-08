// https://sweetalert2.github.io/#examples
import React from 'react';
import Swal from 'sweetalert2'


function AppToolsSweetAlert(){

    function handleClick(){
        Swal.fire(
            'Good job!',
            'You clicked the button!',
            'success'
        )
    }

    
    return(
        <div>
           AppToolsSweetAlert
        
            <div className='bx-button' onClick={handleClick} >
                <button type="submit"  className='button-submit'>บันทึก</button>
            </div>

        </div>
    );

}

export default AppToolsSweetAlert;