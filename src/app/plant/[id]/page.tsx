import PlantDetailsView from "@/components/plant/plant-details-view";

export async function generateMetadata({ params }: { params: { id: string } }) {
  // In a real app, you might fetch metadata from a database
  // For now, we'll use a generic title
  return {
    title: 'Plant Details - LeafWise',
  };
}

export default function PlantPage({ params }: { params: { id: string } }) {
  return <PlantDetailsView id={params.id} />;
}
