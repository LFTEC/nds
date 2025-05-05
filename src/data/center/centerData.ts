
export interface indicatingData {
  id: string,
  batchNo: string,
  vender: string,
  exhibitionDate: Date,
  exhibitionId: string,
  startDate: Date | null,
  finishDate: Date | null,
  indicatingItems: number,
  finishedItems: number
}