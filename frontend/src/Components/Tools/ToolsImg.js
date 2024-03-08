// https://www.npmjs.com/package/simple-react-lightbox
import React from 'react';
import { useState} from "react";
import { SRLWrapper } from 'simple-react-lightbox';



function AppToolsImg(){

    const images= [
        { id: '1', imageName: '/img/logo.png', tag: 'free' },
        { id: '2', imageName: '/img/icon-admin-24.jpg', tag: 'free' },
    ]
    const options = {}
    const [filteredImages] = useState(images);
    
    return(
        <div>
            <SRLWrapper options={options}>
                <div className="container">
                    {filteredImages.map(image => (
                        <div key={image.id} className="image-card">
                            <a href={`${image.imageName}`}>
                                <img className="image" src={`${image.imageName}`} alt="" />
                            </a>
                        </div>
                    ))}
                </div>
            </SRLWrapper>             
        </div>
    );

}

export default AppToolsImg;