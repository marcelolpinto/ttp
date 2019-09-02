import React from 'react'

export const NotFound = () => {
  return (
    <div
      style={{
        height: 'calc(100vh - 64px)',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <h1>404</h1><br/><br/>
      <p>This page doesn't exist.</p>
    </div>
  );
}