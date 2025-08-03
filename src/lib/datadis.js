export const getConsumption = async (cups, startDate, endDate) => {
  try {
    const response = await fetch(
      `/api/datadis/consumption?cups=${cups}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al obtener el consumo");
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error al obtener consumo:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
