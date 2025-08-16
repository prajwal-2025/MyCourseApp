import React from 'react';

/**
 * Displays a list of registrations with filtering and search functionality.
 *
 * @param {object} props - The component's props.
 * @param {Array} props.regs - The array of registration objects to display.
 * @param {string} props.search - The search term to filter registrations by name or phone.
 * @param {string} props.filter - The filter to apply ('all', 'confirmed', 'pending').
 * @param {function} props.onConfirm - The callback function to execute when confirming a registration.
 */
export default function RegistrationsList({ regs, search, filter, onConfirm }) {
  
  // This function determines which status pill to show based on the registration's state.
  const getStatusPill = (reg) => {
    if (reg.confirmed) {
      return <span className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-500/20 rounded-full">Confirmed</span>;
    }
    if (reg.paymentStatus === 'full_payment_pending') {
      return <span className="px-2 py-1 text-xs font-semibold text-yellow-300 bg-yellow-500/20 rounded-full">Pending Full Payment</span>;
    }
    if (reg.paymentStatus === 'seat_lock_pending') {
      return <span className="px-2 py-1 text-xs font-semibold text-blue-300 bg-blue-500/20 rounded-full">Pending Seat Lock</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold text-slate-300 bg-slate-500/20 rounded-full">Pending</span>;
  };

  // Filter and search the registrations based on the props.
  const filteredRegs = regs
    .filter(r => {
      if (filter === 'all') return true;
      if (filter === 'confirmed') return r.confirmed;
      if (filter === 'pending') return !r.confirmed;
      return false;
    })
    .filter(r => 
      (r.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
      (r.phone || '').includes(search)
    );

  return (
    <div className="space-y-4">
      {filteredRegs.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No registrations found for the current filter.</p>
      ) : (
        filteredRegs.map(r => (
          <div key={r.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg text-white">{r.name || 'No Name Provided'}</p>
                <p className="text-sm text-slate-400">{r.phone || 'No Phone'} | {r.college || 'No College'}</p>
              </div>
              {getStatusPill(r)}
            </div>
            <div className="mt-3 border-t border-slate-700 pt-3 text-sm text-slate-300 space-y-1">
              <p><strong>Course:</strong> <span className="font-semibold text-purple-400">{r.courseId === 'bundle' ? 'Combined Course Bundle' : r.courseId?.toUpperCase()}</span></p>
              {r.isFromBundle && <p className="text-xs text-purple-400">(Part of a bundle purchase)</p>}
              <p><strong>Payment:</strong> Paid ₹{r.amountPaid} (Offered: ₹{r.priceOffered})</p>
              <p><strong>Screenshot:</strong> {r.screenshotUrl ? <a href={r.screenshotUrl} target="_blank" rel="noreferrer" className="underline text-indigo-400 hover:text-indigo-300">View Screenshot</a> : 'Not provided'}</p>
            </div>
            {!r.confirmed && (
              <div className="mt-4 text-right">
                <button 
                  onClick={() => onConfirm(r)} 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md transition-colors text-sm"
                >
                  Confirm Registration
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
