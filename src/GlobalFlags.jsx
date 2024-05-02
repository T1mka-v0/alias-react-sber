import React, { useState } from 'react'

export function useIsGameStarted() {
    const [IsGameStarted, setIsGameStarted] = useState(false);
  return {IsGameStarted, setIsGameStarted};
}