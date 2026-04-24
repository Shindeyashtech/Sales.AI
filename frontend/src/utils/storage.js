// // storage.js
// // This file helps us save and read calls
// // from browser's localStorage

// // Save a new call to storage
// export function saveCall(callData) {

//   // Get existing calls from storage
//   const existing = getCalls()

//   // Create a new call object with unique ID
//   const newCall = {
//     id: Date.now(),          // unique number based on time
//     date: new Date().toLocaleDateString(),
//     time: new Date().toLocaleTimeString(),
//     filename: callData.filename,
//     size_mb: callData.size_mb,
//     language: callData.language,
//     transcript: callData.transcript,
//     analysis: callData.analysis,
//   }

//   // Add new call to beginning of list
//   const updated = [newCall, ...existing]

//   // Save back to localStorage
//   localStorage.setItem('calls', JSON.stringify(updated))

//   return newCall
// }

// // Get all saved calls
// export function getCalls() {
//   const calls = localStorage.getItem('calls')
//   return calls ? JSON.parse(calls) : []
// }

// // Get one specific call by ID
// export function getCallById(id) {
//   const calls = getCalls()
//   return calls.find(call => call.id === parseInt(id))
// }

// // Delete a call by ID
// export function deleteCall(id) {
//   const calls = getCalls()
//   const updated = calls.filter(call => call.id !== parseInt(id))
//   localStorage.setItem('calls', JSON.stringify(updated))
// }

// // Clear all calls
// export function clearAllCalls() {
//   localStorage.removeItem('calls')
// }


// storage.js
// Saves and reads calls from browser memory

export function saveCall(callData) {
    const existing = getCalls()

    const newCall = {
        id:         Date.now(),
        date:       new Date().toLocaleDateString(),
        time:       new Date().toLocaleTimeString(),
        filename:   callData.filename,
        size_mb:    callData.size_mb,
        language:   callData.language,
        transcript: callData.transcript,
        analysis:   callData.analysis,
        parsed:     callData.parsed || null,  // ← Save parsed data!
    }

    console.log("Saving call with parsed:", newCall.parsed)

    const updated = [newCall, ...existing]
    localStorage.setItem('calls', JSON.stringify(updated))

    return newCall
}

export function getCalls() {
    const calls = localStorage.getItem('calls')
    return calls ? JSON.parse(calls) : []
}

export function getCallById(id) {
    const calls = getCalls()
    return calls.find(call => call.id === parseInt(id))
}

export function deleteCall(id) {
    const calls    = getCalls()
    const updated  = calls.filter(call => call.id !== parseInt(id))
    localStorage.setItem('calls', JSON.stringify(updated))
}

export function clearAllCalls() {
    localStorage.removeItem('calls')
}