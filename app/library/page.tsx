"use client";

import Link from "next/link";

import { ConnectPrompt } from "@/components/ConnectPrompt/ConnectPrompt";
import { PageHeading } from "@/components/PageHeading/PageHeading";
import { TrackList } from "@/components/TrackList/TrackList";
import { useLibrary } from "@/contexts/LibraryContext";
import { useLibraryAccess } from "@/hooks/useLibraryAccess";

export default function LibraryPage() {
  const canBrowse = useLibraryAccess();
  const { tracks, isLoading, error } = useLibrary();

  return (
    <>
      <PageHeading eyebrow="Library" title="Saved tracks">
        Most recently saved first.
      </PageHeading>
      {!canBrowse ? (
        <ConnectPrompt />
      ) : error ? (
        <p role="alert" className="text-danger">
          {error}
        </p>
      ) : !isLoading && tracks?.length === 0 ? (
        <p className="text-muted">
          Nothing saved yet.{" "}
          <Link href="/" className="text-accent underline-offset-4 hover:underline">
            Browse the catalogue
          </Link>{" "}
          and press Save on a track.
        </p>
      ) : (
        <TrackList
          tracks={tracks ?? []}
          isLoading={isLoading}
          label="Saved tracks"
        />
      )}
    </>
  );
}
