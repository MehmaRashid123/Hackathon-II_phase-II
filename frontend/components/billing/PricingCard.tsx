"use client";

interface Plan {
  name: string;
  price: string;
  frequency: string;
  features: string[];
  current: boolean;
}

interface PricingCardProps {
  plan: Plan;
}

export function PricingCard({ plan }: PricingCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow border-2 ${
      plan.current ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{plan.price}</span>
        <span className="text-sm text-gray-500 ml-2">{plan.frequency}</span>
      </div>
      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="text-sm flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {plan.current ? (
        <button disabled className="w-full py-2 px-4 bg-gray-300 dark:bg-gray-600 rounded-lg">
          Current Plan
        </button>
      ) : (
        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          Upgrade
        </button>
      )}
    </div>
  );
}
