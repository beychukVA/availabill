import Link from "next/link";
import React from "react";
import { RoundPlayIcon } from "../Icons/RoundPlayIcon/RoundPlayIcon";
import styles from "./VideoCard.module.scss";

interface IProps {
  coverImage?: string;
  url?: string;
}

export const VideoCard: React.FC<IProps> = ({ coverImage, url = "" }) => (
  <Link href={url}>
    <div className={styles.container}>
      <img src={coverImage} className={styles.coverImage} />
      <div className={styles.playIcon}>
        <RoundPlayIcon />
      </div>
    </div>
  </Link>
);
