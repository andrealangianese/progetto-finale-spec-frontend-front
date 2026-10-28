import { useTravelLists } from "../context/travelLists";
import useDocumentTitle from "../hooks/useDocumentTitle";
import TravelCard from "../components/travel/TravelCard";
import { Button, Container, EmptyState, PageHeader } from "../components/ui";
import styles from "./FavouritePage.module.css";

export default function FavouritePage() {
    useDocumentTitle("Destinazioni preferite");
    const { preferiti } = useTravelLists();

    return (
        <Container>
            <PageHeader title="Le tue Destinazioni Preferite ❤️" backTo="/" />

            {preferiti.length === 0 ? (
                <EmptyState
                    icon="🤍"
                    title="Nessun preferito, per ora"
                    action={<Button to="/">Esplora i viaggi</Button>}
                >
                    Tocca il cuore su un viaggio per ritrovarlo qui.
                </EmptyState>
            ) : (
                <div className={styles.list}>
                    {preferiti.map((viaggio) => (
                        <TravelCard key={viaggio.id} viaggio={viaggio} />
                    ))}
                </div>
            )}
        </Container>
    );
}
