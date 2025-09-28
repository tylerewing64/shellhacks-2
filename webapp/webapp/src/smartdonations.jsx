import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// If you already use lucide-react elsewhere, you can keep this import.
// Otherwise replace <DropletIcon/> with the inline SVG below.
import { Droplet as DropletIcon } from "lucide-react";

export default function SmartDonations() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState("round_all"); // default selected like the mock
  const [tipAmount, setTipAmount] = useState("");

  const options = [
    {
      id: "round_all",
      title: "Round up all transactions",
      desc:
        "Automatically round up every purchase to the nearest dollar and donate the spare change",
    },
    {
      id: "round_every_other",
      title: "Round up every other transaction",
      desc:
        "Round up every second purchase for a more moderate donation approach",
    },
    {
      id: "add_tip",
      title: "Add an extra tip to help the cause",
      desc:
        "Add a custom amount to your purchases to maximize your impact",
    },
  ];

  function onSubmit(e) {
    e.preventDefault();
    // TODO: call your API to save preferences
    // Example payload:
    // const payload = { mode: selection, tip: selection === "add_tip" ? Number(tipAmount || 0) : 0 }
    // await fetch('/api/smart-donations', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })

    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Top badge/icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 shadow-lg">
          {/* Use lucide icon if available; otherwise uncomment the inline SVG below */}
          <DropletIcon className="h-8 w-8 text-white" />
          {/* <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
            <path d="M12 2.5s6 6.2 6 10.2A6 6 0 1 1 6 12.7C6 8.7 12 2.5 12 2.5Z"/>
          </svg> */}
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Smart Donations</h1>
          <p className="mt-2 text-gray-500">Choose how you'd like to contribute</p>
        </div>

        {/* Card */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5"
        >
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              How much would you like to contribute?
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Select your preferred donation method
            </p>
          </div>

          <div role="radiogroup" className="space-y-4">
            {options.map((opt) => {
              const active = selection === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelection(opt.id)}
                  role="radio"
                  aria-checked={active}
                  className={[
                    "w-full text-left rounded-xl border px-4 py-4 transition",
                    active
                      ? "border-indigo-300 bg-indigo-50/60 ring-2 ring-indigo-200"
                      : "border-gray-200 hover:border-gray-300",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio dot */}
                    <span
                      className={[
                        "mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full border",
                        active
                          ? "border-indigo-600"
                          : "border-gray-300 bg-white",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      <span
                        className={[
                          "h-2.5 w-2.5 rounded-full",
                          active ? "bg-indigo-600" : "bg-transparent",
                        ].join(" ")}
                      />
                    </span>

                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{opt.title}</div>
                      <div className="text-sm text-gray-500">{opt.desc}</div>

                      {/* Tip input shows when add_tip is selected */}
                      {opt.id === "add_tip" && selection === "add_tip" && (
                        <div className="mt-3 flex items-center gap-2">
                          <label
                            htmlFor="tip"
                            className="text-sm text-gray-700"
                          >
                            Tip amount:
                          </label>
                          <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                              $
                            </span>
                            <input
                              id="tip"
                              type="number"
                              min="0"
                              step="0.01"
                              inputMode="decimal"
                              className="w-28 rounded-md border border-gray-300 pl-7 pr-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                              placeholder="0.50"
                              value={tipAmount}
                              onChange={(e) => setTipAmount(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Start Smart Donations
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            You can change or cancel your donation preferences at any time in
            settings
          </p>
        </form>
      </div>
    </div>
  );
}
