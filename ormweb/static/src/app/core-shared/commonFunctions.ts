export function fileNamePattern(fileName: string) {
  const match = /[\^`\;@\&\+\$\%\!\#\{}]/;

  if (match.test(fileName)) {
    return true;
  }
  return false;
}


export interface ReportFrequency {
  FrequencyID: number;
  PeriodStartDate: string;
  PeriodEndDate: string;
}

export function isKriInDateRange(kriDate: string, kriFrequency: number = 1, reportFrequencyData: ReportFrequency[]): boolean {
  if (!kriDate || !reportFrequencyData || reportFrequencyData.length === 0) {
    return false;
  }

  // Find the matching frequency record
  const matchedFrequency = reportFrequencyData.find(
    f => f.FrequencyID === kriFrequency
  );

  if (!matchedFrequency) {
    return false; // No matching frequency found
  }

  const dateToCheck = new Date(kriDate).getTime();
  const startDate = new Date(matchedFrequency.PeriodStartDate).getTime();
  const endDate = new Date(matchedFrequency.PeriodEndDate).getTime();

  return dateToCheck >= startDate && dateToCheck <= endDate;
}
