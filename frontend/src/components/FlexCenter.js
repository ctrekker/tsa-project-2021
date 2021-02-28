import React from 'react';

const FlexCenter = ({ children, style={} }) => ((
    <div style={{display: 'flex', alignItems: 'center', ...style}}>
        {children}
    </div>
));

export default FlexCenter;