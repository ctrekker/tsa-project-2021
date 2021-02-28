import React from 'react';

export default function ProfilePicture({ url }) {
    return (
        <div style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            boxShadow: '#00000017 0px 3px 5px 0',
            border: '2px solid #d5d5d5',
            backgroundImage: `url(${url})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        }}/>
    );
}
