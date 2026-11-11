import portfolioData from '../data/portfolio.json';
import { isProduction } from './env';

export type PieceCategory = 'ornate' | 'logo';

export interface Piece {
  id: string;
  category: PieceCategory;
  title: string;
  before: string;
  after: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  approved: boolean;
  /** Use this piece in the hero. Falls back to the first approved piece. */
  hero?: boolean;
}

const all = portfolioData as unknown as Piece[];

export const approvedPieces: Piece[] = all.filter((piece) => piece.approved);

/**
 * Pieces to show in the Work section.
 * Production: approved pieces only, so no approved piece means no section.
 * Preview: everything, so unapproved pieces appear as clearly marked placeholder frames.
 */
export function piecesForWork(): Piece[] {
  return isProduction ? approvedPieces : all;
}

export function hasWork(): boolean {
  return piecesForWork().length > 0;
}

/** The before/after pair for the hero, or null (text-only hero). */
export function heroPiece(): Piece | null {
  return approvedPieces.find((piece) => piece.hero) ?? approvedPieces[0] ?? null;
}
