import React from 'react';

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Standard Quality", "Limited Access", "Ads included"],
    buttonText: "Start Free",
    bg: "bg-zinc-900"
  },
  {
    name: "Premium Monthly",
    price: "$9.99",
    features: ["Full HD Quality", "Unlimited Access", "No Ads", "Offline Mode"],
    buttonText: "Get Monthly",
    bg: "bg-[#B9090B]" 
  },
  {
    name: "Premium Yearly",
    price: "$89.99",
    features: ["4K + HDR Quality", "Unlimited Access", "No Ads", "Family Plan"],
    buttonText: "Get Yearly",
    bg: "bg-zinc-900"
  }
];

export default function PricingPlans() {
  return (
    <section className="py-20 bg-black text-white px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Choose Your Plan 🚀</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`${plan.bg} p-8 rounded-2xl flex flex-col items-center shadow-xl border border-zinc-800 transition-transform hover:scale-105`}>
              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm font-normal text-zinc-400">/mo</span></p>
              <ul className="mb-8 space-y-3 text-center">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-zinc-300">✓ {feature}</li>
                ))}
              </ul>
              <button className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-zinc-200 transition-colors">
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}