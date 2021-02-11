import React from 'react';

const FlexCenter = ({ children }) => ((
    <div style={{display: 'flex', alignItems: 'center'}}>
        {children}
    </div>
));

export default FlexCenter;