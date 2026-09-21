import { useState, useEffect } from "react";
import ReleaseHero from "../../components/release/ReleaseHero";
import ChangeLog from "../../components/release/ChangeLog";
import { instance } from "../../api/api_instance";

function Release() {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch lightweight version list for version dropdown
  useEffect(() => {
    let isMounted = true;
    const fetchVersions = async () => {
      try {
        setLoading(true);
        const response = await instance.get("/releases/versions");
        const list = response?.data?.data || [];
        if (isMounted) {
          setVersions(list);
          if (list.length > 0) {
            setSelectedVersion(list[0].version);
          }
        }
      } catch {
        if (isMounted) {
          setVersions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVersions();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch complete release data when selectedVersion changes
  useEffect(() => {
    if (!selectedVersion) return;
    let isMounted = true;

    const fetchReleaseDetails = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/releases/${selectedVersion}`);
        const releaseDoc = response?.data?.data;
        if (isMounted) {
          setSelectedRelease(releaseDoc || null);
        }
      } catch {
        if (isMounted) {
          setSelectedRelease(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReleaseDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedVersion]);

  // Extract unique contributors across entries of the selected release
  const uniqueContributors = [];
  const usernames = new Set();

  if (selectedRelease?.entries) {
    selectedRelease.entries.forEach((entry) => {
      const contribs =
        entry.contributors || (entry.contributor ? [entry.contributor] : []);
      contribs.forEach((c) => {
        if (c?.username && !usernames.has(c.username)) {
          usernames.add(c.username);
          uniqueContributors.push({
            ...c,
            profileUrl: c.profileUrl || `https://github.com/${c.username}`,
            avatarUrl:
              c.avatarUrl || `https://unavatar.io/github/${c.username}`,
          });
        }
      });
    });
  }

  return (
    <div>
      <ReleaseHero
        selectedRelease={selectedRelease}
        contributors={uniqueContributors}
      />
      <ChangeLog
        versions={versions}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        selectedRelease={selectedRelease}
        loading={loading}
      />
    </div>
  );
}

export default Release;
