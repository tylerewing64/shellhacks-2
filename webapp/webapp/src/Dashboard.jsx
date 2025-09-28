// src/Dashboard.jsx
import { useState } from "react";
import { ImpactOverview } from "./components/ImpactOverview";
import { RecentActivity } from "./components/RecentActivity";

export default function Dashboard({ onSelectOrganization, onDonationSuccess }) {
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  // Handle organization selection from search
  function handleSelectOrganizationInternal(organization) {
    // Check if organization is already selected
    const isAlreadySelected = selectedOrganizations.some(
      (org) => org.ein === organization.ein
    );

    if (!isAlreadySelected) {
      setSelectedOrganizations((prev) => [...prev, organization]);
      // You could show a toast notification here
      console.log("Organization added:", organization.name);
    }

    // Call parent handler if provided
    if (onSelectOrganization) {
      onSelectOrganization(organization);
    }
  }

  // Handle donation success
  function handleDonationSuccessInternal(donation) {
    console.log("Donation successful:", donation);
    // You could show a toast notification here or update state

    // Call parent handler if provided
    if (onDonationSuccess) {
      onDonationSuccess(donation);
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Your Impact Dashboard</h2>
        <p className="text-muted-foreground">
          See how your everyday purchases are making a difference in the
          world
        </p>
      </div>

      <section>
        <ImpactOverview />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
