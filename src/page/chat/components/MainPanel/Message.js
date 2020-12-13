import React from 'react';

/**
 *
 * @param {object} param
 * @param {object} param.message
 * @param {object} param.user
 */
export default function Message({ message, user }) {
  return (
    <div>
      {message.content} : {message.timestamp}
    </div>
  );
}
